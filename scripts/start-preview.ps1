$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$infoPath = Join-Path $root '.preview\server.json'
if (Test-Path -LiteralPath $infoPath) {
  $old = Get-Content -LiteralPath $infoPath -Raw | ConvertFrom-Json
  $process = Get-CimInstance Win32_Process -Filter "ProcessId = $($old.pid)" -ErrorAction SilentlyContinue
  if ($process -and $process.CommandLine.Contains((Join-Path $root 'scripts\server.mjs'))) {
    try { $response = Invoke-WebRequest -Uri $old.url -TimeoutSec 3; if ($response.StatusCode -eq 200) { Write-Output $old.url; exit 0 } } catch {}
  }
}
New-Item -ItemType Directory -Path (Join-Path $root '.preview') -Force | Out-Null
$node = (Get-Command node).Source
$server = Join-Path $root 'scripts\server.mjs'
$p = Start-Process -FilePath $node -ArgumentList ('"' + $server + '"') -WorkingDirectory $root -WindowStyle Hidden -RedirectStandardOutput (Join-Path $root '.preview\stdout.log') -RedirectStandardError (Join-Path $root '.preview\stderr.log') -PassThru
for ($i = 0; $i -lt 40; $i++) {
  Start-Sleep -Milliseconds 150
  if ($p.HasExited) { throw (Get-Content (Join-Path $root '.preview\stderr.log') -Raw) }
  if (Test-Path -LiteralPath $infoPath) {
    $info = Get-Content -LiteralPath $infoPath -Raw | ConvertFrom-Json
    if ($info.pid -eq $p.Id) { $response = Invoke-WebRequest -Uri $info.url -TimeoutSec 3; if ($response.StatusCode -eq 200) { Write-Output ($info | ConvertTo-Json -Compress); exit 0 } }
  }
}
throw '本任务预览服务未在预期时间内启动，请检查 .preview 日志。'
