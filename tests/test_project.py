import json
import re
import shutil
import subprocess
import unittest
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class IdCollector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []

    def handle_starttag(self, _tag, attrs):
        attributes = dict(attrs)
        if attributes.get("id"):
            self.ids.append(attributes["id"])


class ProjectValidationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = (ROOT / "newtab.html").read_text(encoding="utf-8")
        cls.javascript = (ROOT / "newtab.js").read_text(encoding="utf-8")
        cls.manifest = json.loads((ROOT / "manifest.json").read_text(encoding="utf-8"))

    def test_manifest_content_scripts_exist_and_start_early(self):
        self.assertEqual(self.manifest["manifest_version"], 3)
        self.assertNotIn("bookmarks", self.manifest.get("permissions", []))
        self.assertIn("bookmarks", self.manifest.get("optional_permissions", []))
        for content_script in self.manifest.get("content_scripts", []):
            self.assertEqual(content_script.get("run_at"), "document_start")
            for filename in content_script.get("js", []):
                self.assertTrue((ROOT / filename).is_file(), filename)

    def test_html_ids_are_unique_and_javascript_bindings_exist(self):
        parser = IdCollector()
        parser.feed(self.html)
        self.assertEqual(len(parser.ids), len(set(parser.ids)))
        queried_ids = set(re.findall(r"querySelector\(['\"]#([^'\"]+)", self.javascript))
        self.assertEqual(sorted(queried_ids - set(parser.ids)), [])

    def test_settings_keep_privacy_concise_and_feedback_actionable(self):
        privacy = re.search(
            r'<fieldset class="privacy-settings">(.*?)</fieldset>',
            self.html,
            re.DOTALL,
        )
        self.assertIsNotNone(privacy)
        self.assertEqual(privacy.group(1).count("<a "), 1)
        self.assertNotIn("<p", privacy.group(1))
        self.assertIn("template=bug_report.yml", self.html)
        self.assertIn("template=feature_request.yml", self.html)
        self.assertTrue((ROOT / ".github/ISSUE_TEMPLATE/bug_report.yml").is_file())
        self.assertTrue((ROOT / ".github/ISSUE_TEMPLATE/feature_request.yml").is_file())

    def test_icon_candidates_are_hidden_until_explicitly_requested(self):
        self.assertIn('id="shortcut-icon-chooser" class="shortcut-icon-chooser" hidden', self.html)
        self.assertIn('id="shortcut-change-icon"', self.html)
        self.assertIn('id="shortcut-icon-candidates"', self.html)
        self.assertIn('id="shortcut-fetch-icon"', self.html)

    def test_required_release_files_exist(self):
        required = [
            "manifest.json",
            "newtab.html",
            "newtab.css",
            "newtab-core.js",
            "newtab-platform.js",
            "newtab.js",
            "service-worker.js",
            "ai-relay-core.js",
            "ai-relay.js",
            "icons/icon-16.png",
            "icons/icon-32.png",
            "icons/icon-48.png",
            "icons/icon-128.png",
        ]
        self.assertEqual([name for name in required if not (ROOT / name).is_file()], [])

    def test_javascript_syntax(self):
        node = shutil.which("node")
        if not node:
            self.skipTest("Node.js is not installed")
        for filename in ("newtab-core.js", "newtab-platform.js", "newtab.js", "service-worker.js", "ai-relay-core.js", "ai-relay.js"):
            result = subprocess.run(
                [node, "--check", str(ROOT / filename)],
                capture_output=True,
                text=True,
                check=False,
            )
            self.assertEqual(result.returncode, 0, result.stderr)


if __name__ == "__main__":
    unittest.main()
