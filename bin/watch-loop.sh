#!/bin/bash
# Live Watcher for the Autonomic Loop
clear
echo "🔥 Larry B's Hive Mind: Live Status Monitor 🔥"
echo "------------------------------------------------"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR/.."
TASK_FILE="$PROJECT_DIR/tasks/active.json"

while true; do
  # Get status and task from active.json
  if [ -f "$TASK_FILE" ]; then
    STATUS=$(python3 -c "import json; d=json.load(open('$TASK_FILE')); print(d.get('status','unknown'))" 2>/dev/null)
    TASK=$(python3 -c "import json; d=json.load(open('$TASK_FILE')); print(d.get('milestone','unknown'))" 2>/dev/null)
  else
    STATUS="offline"
    TASK="no active task"
  fi
  
  # Set colors
  COLOR="\033[0;32m" # Green
  [ "$STATUS" == "fixing" ] && COLOR="\033[0;31m" # Red
  [ "$STATUS" == "offline" ] && COLOR="\033[0;33m" # Yellow
  
  # Print status line
  echo -ne "\r\033[K[$(date +%H:%M:%S)] Mode: ${COLOR}${STATUS}\033[0m | Task: \033[1;34m${TASK}\033[0m"
  
  sleep 2
done
