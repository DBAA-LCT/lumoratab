$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$sourcePath = Join-Path $root 'newtab.js'
$outputDir = Join-Path $root 'icons\sites'
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null

$source = Get-Content -LiteralPath $sourcePath -Raw
$matches = [regex]::Matches($source, "url:\s*'(?<url>https?://[^']+)'\s*,\s*category:")
$urls = $matches | ForEach-Object { $_.Groups['url'].Value } | Sort-Object -Unique

foreach ($url in $urls) {
    $hostName = ([uri]$url).Host.ToLowerInvariant() -replace '^www\.', ''
    $safeName = $hostName -replace '[^a-z0-9.-]', '_'
    $target = Join-Path $outputDir "$safeName.png"
    if (Test-Path -LiteralPath $target) { continue }
    $endpoint = "https://www.google.com/s2/favicons?domain_url=$([uri]::EscapeDataString($url))&sz=128"
    try {
        Invoke-WebRequest -Uri $endpoint -OutFile $target -TimeoutSec 20
        if ((Get-Item -LiteralPath $target).Length -lt 100) {
            Remove-Item -LiteralPath $target -Force
        }
    } catch {
        if (Test-Path -LiteralPath $target) { Remove-Item -LiteralPath $target -Force }
        try {
            Invoke-WebRequest -Uri "https://icon.horse/icon/$hostName" -OutFile $target -TimeoutSec 20
            if ((Get-Item -LiteralPath $target).Length -lt 100) { Remove-Item -LiteralPath $target -Force }
        } catch {
            if (Test-Path -LiteralPath $target) { Remove-Item -LiteralPath $target -Force }
            Write-Warning "Icon download failed: $url"
        }
    }
}

Write-Host "Cached $((Get-ChildItem -LiteralPath $outputDir -File).Count) site icons in $outputDir"
