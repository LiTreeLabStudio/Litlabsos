#!/usr/bin/env python3
"""
speak_home.py — Send text to speech through Google Home Mini
Usage: python3 speak_home.py "Your message here"
"""
import sys
import time
import urllib.parse
import pychromecast

DEVICE_NAME = "LiTree BSpkr speaker"

def speak(text: str):
    """Send TTS to Google Home Mini"""
    chromecasts, browser = pychromecast.get_listed_chromecasts(
        friendly_names=[DEVICE_NAME]
    )
    if not chromecasts:
        print(f"ERROR: '{DEVICE_NAME}' not found on network")
        return False

    cast = chromecasts[0]
    cast.wait()

    # Stop current playback
    try:
        cast.quit_app()
        time.sleep(2)
    except Exception:
        pass

    # Build Google TTS URL
    encoded = urllib.parse.quote(text)
    tts_url = (
        f"https://translate.google.com/translate_tts"
        f"?ie=UTF-8&tl=en&client=tw-ob&q={encoded}"
    )

    mc = cast.media_controller
    mc.play_media(tts_url, "audio/mp3")
    mc.block_until_active(timeout=10)

    # Wait for speech to finish (rough estimate: ~0.1s per character)
    duration = max(len(text) * 0.08, 3)
    time.sleep(duration)

    try:
        mc.stop()
    except Exception:
        pass

    pychromecast.discovery.stop_discovery(browser)
    return True

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 speak_home.py 'Your message here'")
        sys.exit(1)

    message = " ".join(sys.argv[1:])
    print(f"Speaking: {message}")
    if speak(message):
        print("Done.")
    else:
        print("Failed.")
