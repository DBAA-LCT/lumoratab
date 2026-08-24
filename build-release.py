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
        archive = DIST / f"lumoratab-{target}-v{version}.zip"
        install = f"""LumoraTab v{version} for {browser}

从浏览器扩展商店安装时无需手动操作。
如需从 ZIP 测试：
1. 解压此 ZIP。
2. 打开 {extensions_url}
3. 开启“开发者模式”。
4. 点击“加载解压缩的扩展程序”，选择能直接看到 manifest.json 的解压目录。

LumoraTab 是一个 Manifest V3 新标签页扩展。
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
