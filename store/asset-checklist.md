# LumoraTab Store Asset and Submission Checklist

## Required code-package assets

- [ ] Final logo selected.
- [ ] PNG extension icons exported at 16×16, 32×32, 48×48, and 128×128.
- [ ] `manifest.json` contains the `icons` map.
- [ ] Store ZIP has `manifest.json` at archive root.
- [ ] ZIP contains only runtime files and extension icons; no source-control or store-document files.
- [ ] JavaScript syntax, ZIP contents, version, and SHA256 validated.

## Microsoft Edge Add-ons

- [ ] Individual or company account enrolled in the Microsoft Edge program.
- [ ] Extension logo: square, recommended 300×300 PNG; minimum 128×128.
- [ ] Full description: 250–10,000 characters.
- [ ] At least 3 screenshots recommended; allowed sizes are 1280×800 or 640×480, maximum 6.
- [ ] Optional small promotional tile: 440×280 PNG.
- [ ] Optional large promotional tile: 1400×560 PNG.
- [ ] Category: Productivity.
- [ ] Privacy, permission, remote-code, and data-use declarations completed.
- [ ] Certification notes pasted from `submission-notes.md`.
- [ ] Visibility and markets selected.

## Chrome Web Store

- [ ] Developer registration, contact email verification, and any requested identity verification completed.
- [ ] Store icon: 128×128 PNG.
- [ ] At least 1 screenshot required; 1280×800 recommended, maximum 5.
- [ ] Small promotional tile: 440×280 PNG.
- [ ] Marquee promotional tile: 1400×560 PNG if requested for featuring.
- [ ] Privacy practices and permission justifications completed.
- [ ] Distribution set to Public after testing.

## Recommended screenshots

1. Main new-tab page with a neutral LumoraTab wallpaper and shortcut grid.
2. Search-provider selector and suggestion panel.
3. Shortcut editing, grouping, and bookmark picker.
4. Theme and Bing/custom wallpaper settings.
5. Dark appearance with a grouped shortcut folder.

Screenshots must not show personal bookmarks, browsing history, account names, email addresses, profile photos, or private URLs. Use a clean test browser profile.

## Public URLs

- Repository: https://github.com/DBAA-LCT/lumoratab
- Support: https://github.com/DBAA-LCT/lumoratab/issues
- Privacy policy: https://github.com/DBAA-LCT/lumoratab/blob/release/v0.4.0/store/privacy-policy.md

## Remaining decisions

- Choose one logo direction and export final raster assets.
- Decide whether to remove third-party favicon fallbacks before submission.
- Decide whether online search suggestions should remain enabled by default or become opt-in.
