import RPi.GPIO
import cv2
import base64

image_path = "trash.png"

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

# Webcam
cam = cv2.VideoCapture(0)

try:
    if not cam.isOpened():
        raise Exception("Could not access webcam")
except Exception as e:
    print(e)
    exit(1)

base64_image = capture_img(cam)    
