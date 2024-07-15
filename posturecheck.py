import RPi.GPIO as GPIO
#import cv2 # for usb cameras
import json
import time
import base64
from openai import OpenAI
import requests
from picamera2 import Picamera2
from libcamera import Transform
from pygame import mixer

#sent POST req to api
import requests

#env file management
import os
from dotenv import load_dotenv, dotenv_values

# for rotating image (testing)
import io
from PIL import Image

load_dotenv()
ELEVEN_API_KEY = os.getenv("ELEVEN_API_KEY")
CREATE_JUDGEMENT_URL = os.getenv("CREATE_JUDGEMENT_URL")

image_path = "figure.png"

VOLUME = 10
INCREASE_PIN = 19
DECREASE_PIN = 26
GPIO.setmode(GPIO.BCM)
GPIO.setup(INCREASE_PIN, GPIO.IN)
GPIO.setup(DECREASE_PIN, GPIO.IN)

CHUNK_SIZE=128
voice_id = "LI6bpCK7RzAFvPBPWFrT"
url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

# Control volume variable, used in button press callback
def increase_vol(pin):
    global VOLUME
    if VOLUME < 10: 
        VOLUME += 1
    print(VOLUME)
    mixer.music.set_volume(VOLUME/10)

def decrease_vol(pin):
    global VOLUME
    if VOLUME > 0: 
        VOLUME -= 1
    print(VOLUME)
    mixer.music.set_volume(VOLUME/10)

# Convert text to speech via Elevenlabs API
def tts(text):
	payload = {
		"text": text,
		"model_id": "eleven_multilingual_v2",
		"voice_settings": {
			"stability": 0.9,
			"similarity_boost": 1,
			"style": 0.5,
			"use_speaker_boost": True
			}
	}

	headers = {
		"Accept": "audio/mpeg",
		"Content-Type": "application/json",
		"xi-api-key": ELEVEN_API_KEY
	}

	return requests.post(url, json=payload, headers=headers)

# Function to encode the image
def encode_image(image_path):
	with open(image_path, "rb") as image_file:
		return base64.b64encode(image_file.read()).decode('utf-8')

# Capture an image, and encode in base64
def capture_img(cam):
	try:
		result, image = cam.read()
		if not result:
			raise Exception("Failed to read from camera")
		cv2.imwrite(image_path, image)          # Write to file
		return encode_image(image_path) # Encode in base64 and return
	except Exception as e:
		print(e)
		exit(1)

def capture_img_rpi():
	try:
		picam2 = Picamera2()
		camera_config = picam2.create_still_configuration(main={"size": (3280, 2464)}, lores={"size": (640, 480)}, display="lores")
		camera_config_ROTATE_180 = picam2.create_still_configuration(main={"size": (3280, 2464)}, lores={"size": (640, 480)}, display="lores", transform=Transform(hflip=True, vflip=True))
		picam2.configure(camera_config)
		picam2.start()
		picam2.capture_file(image_path, format="png")
		picam2.close()

		return encode_image(image_path)
	except Exception as e:
		print(e)
		exit(1)

# take image encoded in base64, rotate 180deg, return base64 string (USED FOR DEBUGGING)
def rotate_180_b64_img(b64_string):
	buffer = io.BytesIO()
	imgdata = base64.b64decode(b64_string)
	img = Image.open(io.BytesIO(imgdata))
	new_img = img.rotate(180)
	new_img.save(buffer, format="PNG")
	img_b64 = base64.b64encode(buffer.getvalue())
	print(img_b64)
	return img_b64

# ask GPT4o if good posture
def posture_check(role, prompt, images):
	image_content = []
	for i in images:
		image_content.append({
				"type": "image_url",
				"image_url": {
						"url": f"data:image/jpeg;base64,{i}"
				}
		})

	completion = client.chat.completions.create(
		model="gpt-4o",
		tool_choice="required",
		tools=[{
			"type": "function",
			"function": {
				"name": "judge_posture",
				"description": "Evaluate image of user and rate posture. There are four categories of posture: Upper Body, Arms, Torso & Legs. You will be given a list of guidelines for each category, and a corresponding array pointer preceding it (example: for 4 guidelines, each guideline will be assigned a number 0-3). For each guideline, you will need to state whether the user in the image appears to be following the guideline or not. If they are not, return a 0 in the corresponding array index for that category's score array. If they are, return a 1. If you cannot tell from the image, return a 2. Then, you will also need to provide a score out of 10, generally rating their posture in that category.",
				"parameters": {
					"type": "object",
					"properties": {
						"upper_body_score": {
							"type": "object",
							"properties": { 
								"guidelines": { "type": "array", "items": { "type": "number", "enum": [0, 1, 2] } },
								"score": { "type": "number" }
							},
							"description": """Here are the 4 pointers you should judge the upper body posture of the user on.

							0. Top of screen level with eyes
							1. Head and neck in neutral position
							2. Ears above shoulders
							3. Relaxed shoulders, not shrugged
							
							Each pointer also has an array index.
							Return a 0 to the corresponding array index if the user is not following that guideline, a 1 if they are, and a 2 if you cannot tell.
							You should also provide a score out of 10 to the end of the array, generally rating the user's upper body posture.
							"""
						},
						"arms_score": {
							"type": "object",
							"properties": { 
								"guidelines": { "type": "array", "items": { "type": "number", "enum": [0, 1, 2] } },
								"score": { "type": "number" }
							},
							"description": """Here are the 7 pointers you should judge the posture of the user's arms on.

							0. Keyboard below elbows
							1. Mouse in line with elbow
							2. Elbows close to body
							3. Elbows bent at 90 degrees
							4. Hands at level of elbows
							5. Wrists straight
							6. Wrists not resting on edge of desk
							
							Each pointer also has an array index.
							Return a 0 to the corresponding array index if the user is not following that guideline, a 1 if they are, and a 2 if you cannot tell.
							You should also append a score out of 10 to the end of the array, generally rating the posture of the user's arms.
							"""
						},
						"torso_score": {
							"type": "object",
							"properties": { 
								"guidelines": { "type": "array", "items": { "type": "number", "enum": [0, 1, 2] } },
								"score": { "type": "number" }
							},
							"description": """Here are the 3 pointers you should judge the posture of the user's torso on.

							0. Head, shoulders and torso in line with the hips
							1. Not twisting to face keyboard and screen
							2. Back of seat in contact and supporting lower back
							
							Each pointer also has an array index.
							Return a 0 to the corresponding array index if the user is not following that guideline, a 1 if they are, and a 2 if you cannot tell.
							You should also provide a score out of 10 to the end of the array, generally rating the posture of the user's torso.
							"""
						},
						"legs_score": {
							"type": "object",
							"properties": { 
								"guidelines": { "type": "array", "items": { "type": "number", "enum": [0, 1, 2] } },
								"score": { "type": "number" }
							},
							"description": """Here are the 4 pointers you should judge the posture of the user's legs on.

							0. Seat is supporting whole thigh
							1. Thighs parallel to floor
							2. Knees same height as hips
							3. Feet on floor
							
							Each pointer also has an array index.
							Return a 0 to the corresponding array index if the user is not following that guideline, a 1 if they are, and a 2 if you cannot tell.
							MAKE SURE YOU USE THESE CORRECTLY, if the relevant body parts are not visible in the image, or you cannot otherwise easily infer if a guideline is being met, or if it simply unclear from the image, ensure you return a 2. If you can see the relevant body parts, or infer otherwise, make sure you are precise about each guideline, and return a 0 or 1 depending on whether each one is being met.
							
							You should also provide a score out of 10, generally rating the posture of the user's legs.
							"""
						},
						"instructions": {
							"type": "string",
							"description": """
								Look at the guidelines I have provided above in each category. Evaluate the posture of the user in the image based off the guidelines, then pick one to two that you see they aren't meeting. Give me a short, brief sentence in a neutral, unemotional tone instructing the user to correct their posture based on those guidelines you've identified.
								If you see the user is not meeting lots of the guidelines, just pick the ones you believe are the most important or relevant to correct.
								If the users posture is good, and they are meeting most or all of the guidelines, tell them that their posture is good, and maybe mention a guideline for the user to remember to maintain, if appropriate.
								If you cannot tell if the user is meeting a guideline, due to it being unclear or not visible in the image, just ignore that guideline.
								If you absolutely cannot tell what's going on in the image and can't give an instruction, just give me a short sentence saying that you cannot tell what's going on in the image.
							"""
						}
					},
					"required": ["upper_body_score", "arms_score", "torso_score", "legs_score", "instructions"]
				}
			}
		}],
		messages=[
			{
					"role": "system"
					, "content": role
			},
			{
				"role": "user"
				, "content": [
						{
								"type": "text",
								"text": prompt
						}
					] + image_content
			}
		],
		temperature=0.1
	)

	return completion


# Webcam
# cam = cv2.VideoCapture(0)

# Assign volume control functions to button press inputs
GPIO.add_event_detect(INCREASE_PIN, GPIO.FALLING, callback=increase_vol, bouncetime=100) 
GPIO.add_event_detect(DECREASE_PIN, GPIO.FALLING, callback=decrease_vol, bouncetime=100)

# OpenAI client
client = OpenAI()

# try:
# 	if not cam.isOpened():
# 		raise Exception("Could not access webcam")
# except Exception as e:
# 	print(e)
# 	exit(1)

while True:
	base64_image = capture_img_rpi() # Capture Image
	with open("imageToSave.png", "wb") as fh:
		fh.write(base64.b64decode(base64_image))
	
	# Process with model
	completion = posture_check(
		role = "You are a medical professional and an expert at judging a persons posture at a desk.",
		prompt = "Based on the provided guidelines for each category, does the person in the image have good posture? Please return a completed array and a score for each category, and then some general instructions. Be generous with your evaluation of each guideline, as the angle and picture quality may be suboptimal for different users. If you think a user is somewhat reasonably meeting a guideline, prefer to judge that they are meeting that guideline instead, and return a 1.",
		images = [base64_image]
	)

	# Parse output
	args = completion.choices[0]
	args = args.message.tool_calls[0].function.arguments
	args = json.loads(args)
	
	# TODO: Send data to API
	args["device_name"] = 'test_device'
	args["pwhash"] = "test_hash"
	print("args: ", args)

	# Prompt response error handling
	if "upper_body_score" not in args:
		args["upper_body_score"] = {'guidelines': [2, 2, 2, 2], 'score': 0}
	if "arms_score" not in args:
		args["arms_score"] = {'guidelines': [2, 2, 2, 2, 2, 2, 2], 'score': 0}
	if "torso_score" not in args:
		args["torso_score"] = {'guidelines': [2, 2, 2], 'score': 0}
	if "legs_score" not in args:
		args["legs_score"] = {'guidelines': [2, 2, 2, 2], 'score': 0}
	if "instructions" not in args:
		args["instructions"] = "I cannot make out your posture from this view."
	print("modified args: ", args)

	response = requests.post(CREATE_JUDGEMENT_URL, json = args)
	print("response: ", response.content)

	# Text to Speech
	response = tts(args["instructions"])

	with open('output.mp3', 'wb') as f:
		for chunk in response.iter_content(chunk_size=CHUNK_SIZE):
			if chunk:
				f.write(chunk)


	# Play the voice
	mixer.init()
	mixer.music.load("output.mp3")
	mixer.music.set_volume(VOLUME/10)
	mixer.music.play()
	while mixer.music.get_busy() == True:
		continue

	time.sleep(15)
