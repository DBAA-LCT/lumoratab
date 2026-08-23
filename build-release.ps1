$ErrorActionPreference = 'Stop'

python (Join-Path $PSScriptRoot 'build-release.py')
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}
