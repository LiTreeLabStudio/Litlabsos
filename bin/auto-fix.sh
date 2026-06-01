#!/bin/bash
# Autonomic Auto-Fix Script
# Injects build errors back into the task state for AI self-correction.

ERROR_LOG=$1
TASK_FILE="/data/data/com.termux/files/home/LiTTreeLabstudios/tasks/active.json"

if [ -z "$ERROR_LOG" ]; then
  echo "❌ Error: No log provided."
  exit 1
fi

if [ ! -f "$TASK_FILE" ]; then
  echo "❌ Error: Active task file not found."
  exit 1
fi

echo "🩹 Injecting error logs into $TASK_FILE..."

# Use python to safely update the JSON
python3 -c "
import json, sys
log = sys.argv[1]
with open('$TASK_FILE', 'r') as f:
    data = json.load(f)
data['error_logs'] = log
data['status'] = 'fixing'
with open('$TASK_FILE', 'w') as f:
    json.dump(data, f, indent=2)
" "$ERROR_LOG"

echo "✅ Error logs injected. AI Executor will see these on the next loop."
