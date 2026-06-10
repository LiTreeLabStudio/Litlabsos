#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
"$DIR/sync.sh"
# Start Next.js with polling to prevent EACCES errors in Termux
echo "🚀 Booting development server..."
export WATCHPACK_POLLING=true
export CHOKIDAR_USEPOLLING=true
export NODE_OPTIONS="--max-old-space-size=1536"
npm run dev
