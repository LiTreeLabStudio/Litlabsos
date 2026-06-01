#!/bin/bash
# Live Watcher for the Autonomic Loop
clear
echo "🔥 LiTTreeLab Hive Mind: Live Status Monitor 🔥"
echo "------------------------------------------------"
while true; do
  # Get status from active.json
  STATUS=\$(python3 -c "import json; print(json.load(open('tasks/active.json'))['status'])" 2>/dev/null)
  TASK=\$(python3 -c "import json; print(json.load(open('tasks/active.json'))['milestone'])" 2>/dev/null)
  
  # Set colors
  COLOR="\033[0;32m" # Green for pending
  if [ "\$STATUS" == "fixing" ]; then COLOR="\033[0;31m"; fi # Red for fixing
  
  # Print status line
  echo -ne "\r\033[K[\$(date +%H:%M:%S)] Mode: \$COLOR\$STATUS\033[0m | Task: \033[1;34m\$TASK\033[0m"
  
  # Check for recent git activity (last 1 min)
  RECENT_PUSH=\$(git log -1 --format="%ar" 2>/dev/null)
  
  sleep 2
done
