from __future__ import annotations

import hashlib
import json
import os
import shutil
import subprocess
import sys
import tempfile
from argparse import ArgumentParser
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parent
DIST = ROOT / "dist"
SOURCE_FILES = ("manifest.json", "newtab.html", "newtab.css", "newtab.js")
TARGETS = {
    "edge": ("Microsoft Edge", "edge://extensions/"),
    "chrome": ("Google Chrome", "chrome://extensions/"),
}


def find_chromium() -> Path | None:
    configured = os.environ.get("CHROME_PATH")
    candidates = [
        Path(configured) if configured else None,
        Path(os.environ.get("LOCALAPPDATA", "")) / "Google/Chrome/Application/chrome.exe",
        Path(os.environ.get("PROGRAMFILES", "")) / "Google/Chrome/Application/chrome.exe",
        Path(os.environ.get("PROGRAMFILES(X86)", "")) / "Microsoft/Edge/Application/msedge.exe",
        Path("/usr/bin/google-chrome"),
        Path("/usr/bin/google-chrome-stable"),
        Path("/usr/bin/chromium"),
        Path("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"),
    ]
    return next((path for path in candidates if path and path.is_file()), None)


def build_crx(version: str, key: Path) -> Path:
    browser = find_chromium()
    if browser is None:
        raise RuntimeError("找不到 Chrome/Edge；可通过 CHROME_PATH 指定浏览器路径")
    if not key.is_file():
        raise RuntimeError(f"CRX 私钥不存在：{key}")

    with tempfile.TemporaryDirectory(prefix="lumoratab-crx-") as temp_dir:
        extension_dir = Path(temp_dir) / "lumoratab"
        extension_dir.mkdir()
        for filename in SOURCE_FILES:
            shutil.copy2(ROOT / filename, extension_dir / filename)

        subprocess.run(
            [
                str(browser),
                f"--pack-extension={extension_dir}",
                f"--pack-extension-key={key.resolve()}",
            ],
            check=True,
        )
        packed = extension_dir.with_suffix(".crx")
        if not packed.is_file():
            raise RuntimeError("浏览器没有生成 CRX 文件")

        artifact = DIST / f"custom-homepage-v{version}.crx"
        shutil.copy2(packed, artifact)
        return artifact


def parse_args():
    parser = ArgumentParser(description="构建 LumoraTab 发布包")
    parser.add_argument(
        "--crx-key",
        type=Path,
        help="用于生成稳定扩展 ID 的 PEM 私钥；不要将私钥提交到 Git",
    )
    parser.add_argument(
        "--require-crx",
        action="store_true",
        help="未提供私钥或 CRX 构建失败时终止发布",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
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

    if args.crx_key:
        artifacts.append(build_crx(version, args.crx_key))
    elif args.require_crx:
        raise RuntimeError("发布要求生成 CRX，但没有提供 --crx-key")

    checksum_lines = []
    for artifact in artifacts:
        digest = hashlib.sha256(artifact.read_bytes()).hexdigest()
        checksum_lines.append(f"{digest}  {artifact.name}")
        print(f"{artifact.name}: {artifact.stat().st_size} bytes")

    checksums = DIST / "SHA256SUMS.txt"
    checksums.write_text(
        "\n".join(checksum_lines) + "\n", encoding="ascii", newline="\n"
    )
    print(f"Checksums: {checksums}")


if __name__ == "__main__":
    try:
        main()
    except (OSError, RuntimeError, subprocess.CalledProcessError) as error:
        print(f"构建失败：{error}", file=sys.stderr)
        raise SystemExit(1) from error
