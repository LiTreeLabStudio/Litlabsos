# LitLabs Frontend - Quick Reference

## Project Location
/data/data/com.termux/files/home/LiTTreeLabstudios

## Dev Server (systemd)
Start:   systemctl --user start litlabs-frontend
Stop:    systemctl --user stop litlabs-frontend
Status:  systemctl --user status litlabs-frontend
Logs:    journalctl --user -u litlabs-frontend -f

## Commands
cd /data/data/com.termux/files/home/LiTTreeLabstudios
npm run dev      # Start dev server (port 3000)
npm run build    # Production build
npm run lint     # ESLint

## From Windows
Open browser to: http://localhost:3000
(Dev server runs natively in WSL2, accessible from Windows browser)
