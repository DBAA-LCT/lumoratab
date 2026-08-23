from __future__ import annotations

import hashlib
import json
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parent
DIST = ROOT / "dist"
SOURCE_FILES = ("manifest.json", "newtab.html", "newtab.css", "newtab.js")
TARGETS = {
    "edge": ("Microsoft Edge", "edge://extensions/"),
    "chrome": ("Google Chrome", "chrome://extensions/"),
}


def main() -> None:
    manifest = json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))
    version = manifest["version"]
    DIST.mkdir(exist_ok=True)
    artifacts: list[Path] = []

    for target, (browser, extensions_url) in TARGETS.items():
        archive = DIST / f"custom-homepage-{target}-v{version}.zip"
        install = f"""Custom Homepage v{version} for {browser}

安装方法：
1. 解压此 ZIP。
2. 打开 {extensions_url}
3. 开启“开发者模式”。
4. 点击“加载解压缩的扩展程序”，选择解压后的 custom-homepage 文件夹。

这是个人自用的 Manifest V3 扩展，不需要上传应用商店。
"""
        with ZipFile(archive, "w", compression=ZIP_DEFLATED, compresslevel=9) as package:
            for filename in SOURCE_FILES:
                package.write(ROOT / filename, filename)
            package.writestr("INSTALL.txt", install.encode("utf-8-sig"))
        artifacts.append(archive)

    checksum_lines = []
    for artifact in artifacts:
        digest = hashlib.sha256(artifact.read_bytes()).hexdigest()
        checksum_lines.append(f"{digest}  {artifact.name}")
        print(f"{artifact.name}: {artifact.stat().st_size} bytes")

    checksums = DIST / "SHA256SUMS.txt"
    checksums.write_text("\n".join(checksum_lines) + "\n", encoding="ascii")
    print(f"Checksums: {checksums}")


if __name__ == "__main__":
    main()
