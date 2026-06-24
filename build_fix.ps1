$ErrorActionPreference='SilentlyContinue'
# Stop any node processes
Get-CimInstance Win32_Process -Filter "name='node.exe'" | ForEach-Object {
  $cmd = $_.CommandLine
  if ($cmd -match 'next') {
    Stop-Process -Id $_.ProcessId -Force
  }
}
# Retry cleanup of .next
$retries=10
for ($i=1; $i -le $retries; $i++) {
  if (Test-Path .next) {
    try {
      Remove-Item -Recurse -Force .next -ErrorAction Stop
      break
    } catch {
      Start-Sleep -Milliseconds 500
    }
  } else { break }
}
# Build and capture output
npm run build > build_final.log 2>&1