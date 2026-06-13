#!/bin/bash
# Monitor Agent -- Continuous monitoring with alerts

LOG_FILE="/data/data/com.termux/files/home/LiTTreeLabstudios/agents/logs/monitor-$(date +%Y%m%d).log"
ALERT_FILE="/data/data/com.termux/files/home/LiTTreeLabstudios/agents/logs/alerts.log"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

alert() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ALERT: $1" | tee -a "$ALERT_FILE" | tee -a "$LOG_FILE"
}

# Check n8n on Windows (via WSL->Windows gateway)
check_n8n() {
  local gateway=$(ip route | awk '/default/ {print $3}')
  local n8n_status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "http://$gateway:5678/healthz" 2>/dev/null)
  
  if [ "$n8n_status" = "200" ]; then
    log "n8n: OK (via $gateway:5678)"
  else
    alert "n8n not responding (status: $n8n_status)"
  fi
}

# Check all endpoints
check_all() {
  log "--- Monitor Check ---"
  
  # Use the host health check wrapper
  if [ -f "$HOME/scripts/host-health-check.sh" ]; then
    log "Running host-health-check.sh..."
    local health_out=$("$HOME/scripts/host-health-check.sh")
    log "$health_out"
    
    if echo "$health_out" | grep -q "DOWN"; then
        alert "Some host services are DOWN"
    fi
  else
    # Fallback to local check if wrapper missing (still fails in Termux but safe)
    for svc in litlabs-frontend litlabs-api-tunnel n8n-tunnel; do
      local status=$(systemctl is-active "$svc" 2>/dev/null || echo "unknown")
      if [ "$status" != "active" ]; then
        alert "Service $svc is $status"
      else
        log "Service $svc: OK"
      fi
    done
  fi
  
  # n8n on Windows
  check_n8n
  
  log "--- Check Complete ---"
}

# Run loop
while true; do
  check_all
  sleep 120  # 2 minutes
done
