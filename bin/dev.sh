#!/bin/bash
# Autonomic Dev Script
# Ensures latest code before starting dev server.

# Get the directory of the script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

# Run sync
"$DIR/sync.sh"

# Start Next.js
echo "🚀 Booting development server..."
npm run dev
