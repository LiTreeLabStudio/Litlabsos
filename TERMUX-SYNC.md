# Termux Sync Setup — LiTreeLabStudio/Litlabsos

## Repo locations
- **WSL (primary):** `/home/litbit/Litlabsos` (native ext4, git works fully)
- **GitHub:** `git@github.com:LiTreeLabStudio/Litlabsos.git`
- **Branch:** `main`
- NOTE: Do NOT use `C:\Main Project` for git ops — git refuses NTFS mounts in WSL

## One-time setup on Termux

### 1. Install required packages
```
pkg update && pkg install -y git openssh
```

### 2. SSH key
Your Termux SSH key (`~/.ssh/id_ed25519`) is already linked to GitHub as `Litree-Ceo`.

### 3. Clone
```
git clone git@github.com:LiTreeLabStudio/Litlabsos.git
cd Litlabsos
```

### 4. Git identity
```
git config --global user.name "litbi"
git config --global user.email "litbi@homebase.local"
```

## Daily workflow

### WSL — pull before work
```
cd /home/litbit/Litlabsos
git pull origin main
```

### WSL — push after changes
```
cd /home/litbit/Litlabsos
git add -A
git commit -m "your message"
git push origin main
```

### Termux — pull before work
```
cd ~/Litlabsos
git pull origin main
```

### Termux — push after changes
```
cd ~/Litlabsos
git add -A
git commit -m "your message"
git push origin main
```

## Project structure
```
Litlabsos/
├── frontend/          # Next.js app (main project)
│   ├── src/
│   │   ├── app/       # App Router (auth, dashboard, API routes)
│   │   ├── components/# React components
│   │   ├── context/   # AuthContext
│   │   ├── lib/       # DB, API, JWT, Supabase clients
│   │   └── knowledge-harvest/
│   ├── public/
│   ├── package.json
│   └── ...
├── n8n/               # n8n workflow JSON
├── supabase_schema.sql
└── README-Homebase3.md
```

## Notes
- Frontend is NOT a separate git repo — it's tracked as regular files in the main repo
- Same SSH key used on both WSL and Termux (linked to GitHub account `Litree-Ceo`)
- `node_modules/` and `.next/` are gitignored
- After pulling, run `cd frontend && npm install` if package.json changed
