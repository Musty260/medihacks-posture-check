import RPi.GPIO
import cv2
import json
import time
import base64
from openai import OpenAI

image_path = "trash.png"

# Function to encode the image
def encode_image(image_path):
	with open("good_posture_2.jpg", "rb") as image_file:
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
		]
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

base64_image = capture_img(cam)

completion = posture_check(
  role = "You are a medical professional and an expert at judging a persons posture at a desk.",
  prompt = """Top of screen level with eyes, about an arm's length away
Relax your shoulders - try to position yourself high enough so you don't need to shrug your shoulders
Keyboard just below elbow height
Seat height equally supports front and back of thighs (or use cushion to raise seated position)
Back of the seat provides good lower back support (or use cushion, to provide additional back support)
Gap of 2-3 cm between front of seat bottom and back of knee
Computer and screen directly in front of you on desk or other surface
Screen and keyboard central - don't twist your back
Mouse in line with elbow

Based on the above guidelines, does the person in the image have good posture? Give a simple Yes or No, a score out of 10, and a single sentence describing what is good and bad. If you cannot tell from the image if the person is meeting a specific guideline, just ignore it.
	""",
  images = [base64_image]
)

# Parse output
args = completion.choices[0]

print(args)
