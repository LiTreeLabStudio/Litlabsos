#!/usr/bin/env python3
"""
voice_owl.py — Always-listening voice interface for OWL
Say "Hey OWL" → records command → processes → responds through Google Home

Usage: python3 voice_owl.py
"""
import os
import sys
import time
import json
import subprocess
import urllib.request
import urllib.parse

# ── Config ──────────────────────────────────────────────
WAKE_WORD = "hey owl"
DEVICE_NAME = "LiTree BSpkr speaker"
HOME = os.environ.get("HOME", "/data/data/com.termux/files/home")

# ── Audio Recording ──────────────────────────────────────
def record_audio(duration=6):
    """Record audio from mic, return FLAC file path"""
    raw_file = f"{HOME}/.owl_raw"
    flac_file = f"{HOME}/.owl_voice.flac"

    # Find existing raw files and clean them
    for ext in ["", ".mp3", ".m4a", ".aac", ".opus", ".amr"]:
        try:
            os.remove(raw_file + ext)
        except OSError:
            pass

    # Record with default encoder
    subprocess.run(
        ["termux-microphone-record", "-l", str(duration), "-f", raw_file],
        capture_output=True, timeout=duration + 5
    )
    time.sleep(0.5)

    # Find the recorded file
    raw_path = None
    for ext in ["", ".mp3", ".m4a", ".aac", ".opus", ".amr"]:
        if os.path.exists(raw_file + ext):
            raw_path = raw_file + ext
            break

    if not raw_path or not os.path.exists(raw_path):
        print("  [ERROR] Recording not found")
        return None

    # Convert to FLAC
    subprocess.run(
        ["ffmpeg", "-y", "-i", raw_path, "-ar", "16000", "-ac", "1", "-f", "flac", flac_file],
        capture_output=True, timeout=15
    )

    # Cleanup raw
    try:
        os.remove(raw_path)
    except OSError:
        pass

    return flac_file if os.path.exists(flac_file) else None

# ── Speech-to-Text ──────────────────────────────────────
def speech_to_text(flac_file):
    """Convert speech to text using Google web speech API"""
    try:
        with open(flac_file, "rb") as f:
            audio_data = f.read()

        req = urllib.request.Request(
            "https://www.google.com/speech-api/v2/recognize"
            "?client=chromium&lang=en-US&key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw",
            data=audio_data,
            headers={"Content-Type": "audio/x-flac; rate=16000"}
        )
        resp = urllib.request.urlopen(req, timeout=10)
        result = json.loads(resp.read().decode())

        if result.get("result"):
            alternatives = result["result"][0].get("alternative", [])
            if alternatives:
                return alternatives[0].get("transcript", "").lower()
    except Exception as e:
        print(f"  [STT ERROR] {e}")
    return ""

# ── Text-to-Speech via Google Home ──────────────────────
def speak(text):
    """Speak text through Google Home Mini"""
    try:
        import pychromecast
        chromecasts, browser = pychromecast.get_listed_chromecasts(
            friendly_names=[DEVICE_NAME]
        )
        if not chromecasts:
            print(f"  [ERROR] '{DEVICE_NAME}' not found")
            # Fallback to phone speaker
            subprocess.run(["termux-tts-speak", text], timeout=15)
            return False

        cast = chromecasts[0]
        cast.wait()

        try:
            cast.quit_app()
            time.sleep(2)
        except Exception:
            pass

        encoded = urllib.parse.quote(text)
        tts_url = (
            f"https://translate.google.com/translate_tts"
            f"?ie=UTF-8&tl=en&client=tw-ob&q={encoded}"
        )

        mc = cast.media_controller
        mc.play_media(tts_url, "audio/mp3")
        mc.block_until_active(timeout=10)
        time.sleep(max(len(text) * 0.08, 3))
        try:
            mc.stop()
        except Exception:
            pass

        pychromecast.discovery.stop_discovery(browser)
        return True
    except ImportError:
        subprocess.run(["termux-tts-speak", text], timeout=15)
        return False
    except Exception as e:
        print(f"  [TTS ERROR] {e}")
        subprocess.run(["termux-tts-speak", text], timeout=15)
        return False

# ── Command Processing ──────────────────────────────────
def process_command(text):
    """Process voice command and return response"""
    text = text.lower().strip()
    print(f"  [COMMAND] {text}")

    # Status
    if any(w in text for w in ["status", "how are you", "what's up", "check", "how we doing"]):
        return check_status()

    # Deploy
    if any(w in text for w in ["deploy", "push", "update site", "update website", "publish"]):
        return deploy_site()

    # PC check
    if any(w in text for w in ["pc", "computer", "monolith", "windows"]):
        return check_pc()

    # Agents
    if any(w in text for w in ["brain", "nemo", "nemoclaw", "jarvis", "agents"]):
        return check_agents()

    # Help
    if any(w in text for w in ["help", "what can you do", "commands", "what are you"]):
        return ("I'm OWL, your voice assistant. I can check system status, "
                "deploy your website, check if your PC is online, "
                "and check your AI agents. Just say hey owl, then your command.")

    # Greetings
    if any(w in text for w in ["hello", "hi", "hey", "good morning", "good evening"]):
        return "Hey Larry! What do you need?"

    # Thanks
    if any(w in text for w in ["thank", "thanks"]):
        return "You're welcome!"

    # Website/GitHub check
    if any(w in text for w in ["website", "site", "github", "repo"]):
        return check_website()

    return f"I heard: {text}. I'm not sure how to handle that yet. Try asking for status."

def check_status():
    parts = []
    for name, port in [("Jarvis", 8080), ("NemoClaw", 8081)]:
        try:
            r = urllib.request.urlopen(f"http://127.0.0.1:{port}/health", timeout=2)
            parts.append(f"{name} is online" if r.status == 200 else f"{name} is error")
        except Exception:
            parts.append(f"{name} is offline")

    try:
        r = subprocess.run(["ping", "-c", "1", "-W", "3", "100.107.123.73"],
                          capture_output=True, timeout=5)
        parts.append("PC is online" if r.returncode == 0 else "PC is offline")
    except Exception:
        parts.append("PC check failed")

    return ". ".join(parts) + "."

def check_pc():
    try:
        r = subprocess.run(["ping", "-c", "1", "-W", "3", "100.107.123.73"],
                          capture_output=True, timeout=5)
        return "Your PC is online via Tailscale." if r.returncode == 0 else \
               "Your PC is unreachable. It may be asleep or sshd may be hung."
    except Exception:
        return "Could not reach your PC."

def check_agents():
    results = []
    for name, port in [("Jarvis", 8080), ("NemoClaw", 8081)]:
        try:
            r = urllib.request.urlopen(f"http://127.0.0.1:{port}/health", timeout=2)
            results.append(f"{name} is online")
        except Exception:
            results.append(f"{name} is offline")
    return ". ".join(results) + "."

def check_website():
    try:
        r = urllib.request.urlopen("https://litlabs.net", timeout=5)
        return f"Your website is live. Status code {r.status}."
    except Exception as e:
        return f"Website check failed: {e}"

def deploy_site():
    try:
        r = subprocess.run(
            ["vercel", "--prod", "--yes"],
            capture_output=True, text=True, timeout=120,
            cwd=f"{HOME}/Litlabsos"
        )
        return "Website deployed successfully." if r.returncode == 0 else \
               f"Deployment error: {r.stderr[-200:]}"
    except subprocess.TimeoutExpired:
        return "Deployment timed out. Check Vercel dashboard."
    except Exception as e:
        return f"Deployment error: {e}"

# ── Main Loop ───────────────────────────────────────────
def main():
    print("=" * 50)
    print("  OWL Voice System — Always Listening")
    print(f"  Wake word: '{WAKE_WORD}'")
    print(f"  Speaker: {DEVICE_NAME}")
    print("=" * 50)
    print()
    print("Listening... (say 'Hey OWL' + command)")
    print("Ctrl+C to stop")
    print()

    speak("OWL voice is online. Say hey owl to talk to me.")

    while True:
        try:
            print("[🎤 Listening...]")
            flac = record_audio(duration=6)
            if not flac:
                time.sleep(1)
                continue

            text = speech_to_text(flac)
            try:
                os.remove(flac)
            except OSError:
                pass

            if not text:
                print("  [SKIP] No speech detected")
                time.sleep(0.5)
                continue

            print(f"  [HEARD] '{text}'")

            if WAKE_WORD in text:
                cmd = text.split(WAKE_WORD, 1)[-1].strip()
                if not cmd:
                    speak("Yes?")
                    print("[🎤 Listening for command...]")
                    flac2 = record_audio(duration=5)
                    if flac2:
                        cmd = speech_to_text(flac2)
                        try:
                            os.remove(flac2)
                        except OSError:
                            pass

                if cmd:
                    response = process_command(cmd)
                    print(f"  [RESPONSE] {response}")
                    speak(response)
                else:
                    speak("I didn't catch that.")
            else:
                print("  [IGNORE] No wake word")

            time.sleep(0.5)

        except KeyboardInterrupt:
            print("\nShutting down.")
            speak("Goodbye. OWL is going to sleep.")
            break
        except Exception as e:
            print(f"  [ERROR] {e}")
            time.sleep(2)

if __name__ == "__main__":
    main()
