$ErrorActionPreference='SilentlyContinue'
if (Test-Path .next) { Remove-Item -Recurse -Force .next }
npm run build > build_verify.log 2>&1
Get-Content build_verify.log