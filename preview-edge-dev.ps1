$ErrorActionPreference = 'Stop'

$extensionDir = $PSScriptRoot
$devProfile = Join-Path $env:LOCALAPPDATA 'CustomHomepageEdgeDev'
$edgeCandidates = @(
    (Join-Path ${env:ProgramFiles(x86)} 'Microsoft\Edge\Application\msedge.exe'),
    (Join-Path $env:ProgramFiles 'Microsoft\Edge\Application\msedge.exe'),
    (Join-Path $env:LOCALAPPDATA 'Microsoft\Edge\Application\msedge.exe')
)
$edge = $edgeCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $edge) {
    throw 'Microsoft Edge was not found.'
}

$defaultProfile = Join-Path $env:LOCALAPPDATA 'Microsoft\Edge\User Data\Default'
$bookmarkSource = Join-Path $defaultProfile 'Bookmarks'
$bookmarkTarget = Join-Path $devProfile 'Default\Bookmarks'

if ((Test-Path $bookmarkSource) -and -not (Test-Path $bookmarkTarget)) {
    $bookmarkFolder = Split-Path -Parent $bookmarkTarget
    New-Item -ItemType Directory -Path $bookmarkFolder -Force | Out-Null
    Copy-Item -Path $bookmarkSource -Destination $bookmarkTarget -Force
    Write-Host 'Copied Edge bookmarks to the development profile.'
}

$preferencesPath = Join-Path $devProfile 'Default\Preferences'
$extensionLoaded = $false
if (Test-Path $preferencesPath) {
    try {
        $preferences = Get-Content -Raw -Path $preferencesPath | ConvertFrom-Json
        foreach ($entry in $preferences.extensions.settings.PSObject.Properties) {
            if ($entry.Value.path -and ($entry.Value.path.TrimEnd('\') -ieq $extensionDir.TrimEnd('\'))) {
                $extensionLoaded = $true
                break
            }
        }
    } catch {
        $extensionLoaded = $false
    }
}

if ($extensionLoaded) {
    $startUrl = 'edge://newtab/'
    Write-Host 'Development extension found. Opening the custom new tab.'
} else {
    $startUrl = 'edge://extensions/'
    Write-Host 'First run: enable Developer mode and load the unpacked extension once.'
    Write-Host "Extension folder: $extensionDir"
}

$arguments = @(
    "--user-data-dir=$devProfile"
    '--no-first-run'
    '--no-default-browser-check'
    '--remote-debugging-address=127.0.0.1'
    '--remote-debugging-port=9229'
    '--new-window'
    $startUrl
)

Write-Host "Starting Edge development profile: $devProfile"
Start-Process -FilePath $edge -ArgumentList $arguments
Write-Host 'Edge development window started.'
