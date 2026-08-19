# Start local MongoDB (Windows). Run in a separate terminal before npm run dev.
$dbPath = "$env:USERPROFILE\data\db"
$mongod = "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"

if (-not (Test-Path $mongod)) {
  Write-Error "mongod.exe not found. Install MongoDB or update the path in this script."
  exit 1
}

New-Item -ItemType Directory -Force -Path $dbPath | Out-Null
Write-Host "Starting MongoDB on 127.0.0.1:27017 ..."
& $mongod --dbpath $dbPath --bind_ip 127.0.0.1 --port 27017
