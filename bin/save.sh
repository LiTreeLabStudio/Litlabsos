#!/bin/bash
# Autonomic Save Script
# Gatekeeper for code quality. Lints, type-checks, commits, and pushes.

MESSAGE=$1
if [ -z "$MESSAGE" ]; then
  echo "❌ Error: Please provide a commit message."
  echo "Usage: npm run save \"your message\""
  exit 1
fi

echo "💾 Starting Autonomic Save: \"$MESSAGE\""

# 1. Linting
echo "🔍 Running ESLint..."
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ ESLint failed. Fix errors before saving."
  exit 1
fi

# 2. Type Checking
echo "🏗️ Running TypeScript compiler check..."
npx tsc --noEmit
if [ $? -ne 0 ]; then
  echo "❌ Type checking failed. Fix errors before saving."
  exit 1
fi

# 3. Git Operations
echo "🚀 Quality checks passed. Pushing to GitHub..."
git add .
git commit -m "$MESSAGE"
git push origin $(git rev-parse --abbrev-ref HEAD)

if [ $? -eq 0 ]; then
  echo "✅ Save and push complete!"
else
  echo "❌ Push failed. Check your connection or remote state."
  exit 1
fi
