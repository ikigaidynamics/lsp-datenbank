$conns = Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue
if ($conns) {
    $conns | ForEach-Object { taskkill /F /PID $_.OwningProcess 2>&1 }
    Start-Sleep -Seconds 1
}
$conns2 = Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue
if ($conns2) {
    $conns2 | ForEach-Object { taskkill /F /PID $_.OwningProcess 2>&1 }
}
Write-Host "Done"
