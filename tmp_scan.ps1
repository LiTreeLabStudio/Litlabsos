Write-Host "=== SYSTEM INFO ==="
$os = Get-CimInstance Win32_OperatingSystem
Write-Host "OS: $($os.Caption) $($os.Version)"
Write-Host "RAM: $([math]::Round($os.TotalVisibleMemorySize/1MB, 1)) GB"
Write-Host "Disk Free: $([math]::Round($os.FreePhysicalMemory/1MB, 1)) GB"
Write-Host ""

Write-Host "=== DEV TOOLS ==="
$node = Get-Command node -ErrorAction SilentlyContinue
$npm = Get-Command npm -ErrorAction SilentlyContinue
$git = Get-Command git -ErrorAction SilentlyContinue
$python = Get-Command python -ErrorAction SilentlyContinue
$uv = Get-Command uv -ErrorAction SilentlyContinue
Write-Host "Node: $($node.Version) ($($node.Source)" -ErrorAction SilentlyContinue
if (-not $node) { Write-Host "Node: NOT FOUND" }
Write-Host "npm: $($npm.Version)" -ErrorAction SilentlyContinue
Write-Host "Git: $($git.Version)" -ErrorAction SilentlyContinue
Write-Host "Python: $($python.Version) ($($python.Source))" -ErrorAction SilentlyContinue
Write-Host "UV: $($uv.Version)" -ErrorAction SilentlyContinue
Write-Host ""

Write-Host "=== NODE PROCESSES ==="
Get-Process -Name node -ErrorAction SilentlyContinue | Select-Object Id, ProcessName, StartTime | Format-Table -AutoSize
if (-not $?) { Write-Host "No node processes running" }
Write-Host ""

Write-Host "=== PORT 3000 ==="
$port = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port) {
    Write-Host "Port 3000 is LISTENING"
    $port | Select-Object LocalPort, OwningProcess, State | Format-Table -AutoSize
} else {
    Write-Host "Port 3000 is NOT listening (dev server not running)"
}
Write-Host ""

Write-Host "=== SSH ==="
Get-Service -Name sshd -ErrorAction SilentlyContinue | Select-Object Name, Status, StartType | Format-Table -AutoSize
Write-Host ""

Write-Host "=== REPO STATUS ==="
Set-Location "C:\home\litbit\LiTTreeLabstudios"
$gitStatus = git status --porcelain 2>&1
$gitBranch = git branch --show-current 2>&1
$gitRemote = git remote -v 2>&1 | Select-Object -First 2
Write-Host "Branch: $gitBranch"
Write-Host "Status: $(if ($gitStatus) { $gitStatus } else { 'clean' })"
Write-Host "Remotes:"
$gitRemote | ForEach-Object { Write-Host "  $_" }
Write-Host ""

Write-Host "=== ENV VARS STATUS ==="
$envFile = "C:\home\litbit\LiTTreeLabstudios\.env.local"
if (Test-Path $envFile) {
    $lines = Get-Content $envFile
    foreach ($line in $lines) {
        if ($line -match '^([A-Z_]+)=(.*)$') {
            $key = $Matches[1]
            $val = $Matches[2]
            if ($val -match 'REPLACE|REGENERATE|\*\*\*') {
                Write-Host "  MISSING: $key"
            } elseif ($val -match '^sk_live_|^whsec_|^pk_live_') {
                Write-Host "  OK: $key (real key)"
            } elseif ($val -match '^eyJ') {
                Write-Host "  OK: $key (JWT)"
            } elseif ($val.length -gt 5) {
                Write-Host "  OK: $key"
            }
        }
    }
} else {
    Write-Host "  .env.local NOT FOUND"
}
Write-Host ""

Write-Host "=== NODE_MODULES ==="
if (Test-Path "C:\home\litbit\LiTTreeLabstudios\node_modules\.package-lock.json") {
    Write-Host "node_modules: INSTALLED"
} else {
    Write-Host "node_modules: MISSING"
}
Write-Host ""

Write-Host "=== NEXT BUILD CACHE ==="
if (Test-Path "C:\home\litbit\LiTTreeLabstudios\.next") {
    $nextSize = (Get-ChildItem -Path "C:\home\litbit\LiTTreeLabstudios\.next" -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    Write-Host ".next cache: $([math]::Round($nextSize/1MB, 1)) MB"
} else {
    Write-Host ".next cache: NOT PRESENT (never built)"
}
