import RPi.GPIO
import cv2
import json
import time
import base64
from openai import OpenAI
import requests
# import pygame

image_path = "figure.png"

CHUNK_SIZE=128
ELEVEN_API_KEY = "sk_69a13fb5f587f9bfe919a7bea741bdd2f87878f3d895a137" 
voice_id = "LI6bpCK7RzAFvPBPWFrT"
url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

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
							"type": "array",
							"items": { "type": "string" },
							"description": """Here are the 4 pointers you should judge the upper body posture of the user on.

							0. Top of screen level with eyes
							1. Head and neck in neutral position
							2. Ears above shoulders
							3. Relaxed shoulders, not shrugged
							
							Each pointer also has an array index.
							Return a 0 to the corresponding array index if the user is not following that guideline, a 1 if they are, and a 2 if you cannot tell.
							You should also provide a score out of 10 to the end of the array, generally rating the users upper body posture.
							ALSO, append a short, brief sentence to the array describing their upper body posture. This sentence should be written as if you are speaking to the user, and written in a neutral, unemotional tone.
							"""
						}
					}
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
cam = cv2.VideoCapture(0)

# OpenAI client
client = OpenAI()

try:
	if not cam.isOpened():
		raise Exception("Could not access webcam")
except Exception as e:
	print(e)
	exit(1)

while True:
	base64_image = capture_img(cam) # Capture Image
	
	# Process with model
	completion = posture_check(
		role = "You are a medical professional and an expert at judging a persons posture at a desk.",
		prompt = "Based on the provided guidelines for each category, does the person in the image have good posture? Please return a completed array for each category. Be generous with your evaluation of each guideline, as the angle and picture quality may be suboptimal for different users. If you think a user is somewhat reasonably meeting a guideline, prefer to judge that they are instead, and return a 1.",
		images = [base64_image]
	)

	# Parse output
	args = completion.choices[0]
	args = args.message.tool_calls[0].function.arguments
	args = json.loads(args)
	
	# TODO: Send data to API

	# TODO : Convey advice to user
	print(args)
	print(args["upper_body_score"][5])

	response = tts(args["upper_body_score"][5])

	with open('output.mp3', 'wb') as f:
		for chunk in response.iter_content(chunk_size=CHUNK_SIZE):
			if chunk:
				f.write(chunk)

	# pygame.mixer.init()
	# pygame.mixer.music.load("output.mp3")
	# pygame.mixer.music.play()
	# while pygame.mixer.music.get_busy() == True:
	# 	continue

	time.sleep(15)
