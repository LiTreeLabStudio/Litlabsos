#!/bin/bash
# Autonomic Sync Script
# Stashes local work, fetches latest code, and reapplies local work.

echo "🔄 Starting Autonomic Sync..."

# Stash local changes
WIP_STASHED=false
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "📦 Stashing local changes..."
  git stash push -m "autonomic-sync-wip-$(date +%s)"
  WIP_STASHED=true
fi

# Pull latest code
echo "📥 Fetching and rebasing from origin..."
git pull --rebase origin $(git rev-parse --abbrev-ref HEAD)

# Pop stash if we stashed
if [ "$WIP_STASHED" = true ]; then
  echo "📤 Reapplying local changes..."
  git stash pop
fi

# Auto-install if package.json changed in the pull
if git diff --name-only ORIG_HEAD HEAD | grep -q "package.json"; then
  echo "📦 package.json changed. Installing dependencies..."
  npm install --silent
fi

echo "✅ Sync complete!"
