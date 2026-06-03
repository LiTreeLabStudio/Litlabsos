#!/bin/bash
# Smart Brain Heartbeat Script
# Runs the AI-powered autonomic loop in the background

LOG_FILE="/data/data/com.termux/files/home/LiTTreeLabstudios/agents/logs/brain.log"
mkdir -p "$(dirname "$LOG_FILE")"

cd /data/data/com.termux/files/home/LiTTreeLabstudios
export $(grep -v '^#' .env.local | xargs 2>/dev/null)

# 1. Start Job Worker (Background Bridge)
if ! pgrep -f "node bin/job-worker.mjs" > /dev/null; then
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting Neural Job Worker..." >> "$LOG_FILE"
  nohup node bin/job-worker.mjs >> "$LOG_FILE" 2>&1 &
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Smart Brain Heartbeat initialized." >> "$LOG_FILE"

while true; do
  TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
  
  # 2. System Telemetry Ping
  CPU=$(top -bn1 | grep -i '%cpu' | head -1 | grep -oE '[0-9]+%cpu' | grep -oE '[0-9]+')
  RAM=$(free -m | awk '/Mem:/ {print int($3/$2 * 100)}')
  
  curl -s -X POST "${NEXT_PUBLIC_SITE_URL}/api/telemetry" \
    -H "Content-Type: application/json" \
    -d "{\"cpu\": \"${CPU:-0}%\", \"ram\": \"${RAM:-0}%\", \"interactions\": 0}" >> "$LOG_FILE" 2>&1

  # 3. Autonomic Intelligence Loop
  if [ -f "bin/smart-brain.mjs" ]; then
    node bin/smart-brain.mjs >> "$LOG_FILE" 2>&1
  else
    echo "[$TIMESTAMP] Error: smart-brain.mjs not found." >> "$LOG_FILE"
  fi
  
  # Keep log file small
  tail -n 200 "$LOG_FILE" > "$LOG_FILE.tmp" && mv "$LOG_FILE.tmp" "$LOG_FILE"
  
  sleep 30
done
