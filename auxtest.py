from pygame import mixer
import RPi.GPIO as GPIO

VOLUME = 5
INCREASE_PIN = 17
DECREASE_PIN = 27
GPIO.setmode(GPIO.BCM)
GPIO.setup(INCREASE_PIN, GPIO.IN)
GPIO.setup(DECREASE_PIN, GPIO.IN)

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

GPIO.add_event_detect(INCREASE_PIN, GPIO.FALLING, callback=increase_vol, bouncetime=100) 
GPIO.add_event_detect(DECREASE_PIN, GPIO.FALLING, callback=decrease_vol, bouncetime=100)

mixer.init()

mixer.music.load("./output.mp3")
mixer.music.set_volume(VOLUME/10)
mixer.music.play()

while True:
    input()
