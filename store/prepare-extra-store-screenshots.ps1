Add-Type -AssemblyName System.Drawing

$outputDir = Join-Path $PSScriptRoot 'assets\screenshots'
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$items = @(
    @{
        Source = 'C:\Users\Leonard\AppData\Local\Temp\codex-clipboard-e46f6a5b-af40-4e6b-9619-94ee4fa3fc96.jpg'
        Target = 'search-and-shortcuts.png'
    },
    @{
        Source = 'C:\Users\Leonard\AppData\Local\Temp\codex-clipboard-6037e5a6-2fbd-4554-b580-e205705f0a71.jpg'
        Target = 'ai-question.png'
    }
)

foreach ($item in $items) {
    $source = [System.Drawing.Bitmap]::FromFile($item.Source)
    try {
        $scale = [Math]::Min(1280 / $source.Width, 800 / $source.Height)
        $width = [Math]::Round($source.Width * $scale)
        $height = [Math]::Round($source.Height * $scale)
        $x = [Math]::Floor((1280 - $width) / 2)
        $y = [Math]::Floor((800 - $height) / 2)

        $canvas = New-Object System.Drawing.Bitmap 1280, 800
        try {
            $graphics = [System.Drawing.Graphics]::FromImage($canvas)
            try {
                $graphics.Clear([System.Drawing.Color]::White)
                $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
                $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
                $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
                $graphics.DrawImage($source, $x, $y, $width, $height)
            }
            finally {
                $graphics.Dispose()
            }

            $target = Join-Path $outputDir $item.Target
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
