Add-Type -AssemblyName System.Drawing

$sourceDir = Join-Path $PSScriptRoot '..\docs\screenshots'
$outputDir = Join-Path $PSScriptRoot 'assets\screenshots'
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

Get-ChildItem -LiteralPath $sourceDir -Filter '*.png' | ForEach-Object {
    $source = [System.Drawing.Bitmap]::FromFile($_.FullName)
    try {
        if ($source.Width -ne 1280 -or $source.Height -ne 720) {
            throw "Unexpected screenshot dimensions for $($_.Name): $($source.Width)x$($source.Height)"
        }

        $canvas = New-Object System.Drawing.Bitmap 1280, 800
        try {
            $graphics = [System.Drawing.Graphics]::FromImage($canvas)
            try {
                $graphics.Clear($source.GetPixel(0, 0))
                $graphics.DrawImageUnscaled($source, 0, 40)
            }
            finally {
                $graphics.Dispose()
            }

            $target = Join-Path $outputDir $_.Name
            $canvas.Save($target, [System.Drawing.Imaging.ImageFormat]::Png)
        }
        finally {
            $canvas.Dispose()
        }
    }
    finally {
        $source.Dispose()
    }
}
