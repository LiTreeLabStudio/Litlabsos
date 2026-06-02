#!/bin/bash
# clean-tv.sh - Maintenance script for Hisense 4K (Android TV)
# Larry B - LiTTreeLabstudios

TV_IP="192.168.1.100" # User should update this or we can auto-discover

echo "=== Hisense 4K Maintenance Loop ==="

# 1. Connect to TV
echo "Connecting to $TV_IP..."
adb connect $TV_IP

# 2. Clear Cache (Deep Clean)
echo "Trimming caches..."
adb shell pm trim-caches 999G

# 3. Kill background processes to free RAM
echo "Optimizing memory..."
adb shell am kill-all

# 4. (Optional) Clear specific large app caches if needed
# adb shell pm clear com.google.android.youtube.tv

echo "=== TV Optimized ==="
adb disconnect $TV_IP
