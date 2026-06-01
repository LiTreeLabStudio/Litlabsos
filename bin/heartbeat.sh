#!/bin/bash
# Smart Brain Heartbeat Script
# Runs the AI-powered autonomic loop in the background

LOG_FILE="/data/data/com.termux/files/home/LiTTreeLabstudios/agents/logs/brain.log"
mkdir -p "$(dirname "$LOG_FILE")"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] Smart Brain Heartbeat initialized." >> "$LOG_FILE"

while true; do
  TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
  
  # Run the Node.js smart brain
  if [ -f "/data/data/com.termux/files/home/LiTTreeLabstudios/bin/smart-brain.mjs" ]; then
    # Load env variables and run
    cd /data/data/com.termux/files/home/LiTTreeLabstudios
    export $(grep -v '^#' .env.local | xargs 2>/dev/null)
    node bin/smart-brain.mjs >> "$LOG_FILE" 2>&1
  else
    echo "[$TIMESTAMP] Error: smart-brain.mjs not found." >> "$LOG_FILE"
  fi
  
  # Keep log file small
  tail -n 100 "$LOG_FILE" > "$LOG_FILE.tmp" && mv "$LOG_FILE.tmp" "$LOG_FILE"
  
  # Wait 30 seconds before next autonomic cycle
  sleep 30
done
