# LumoraTab Store Asset and Submission Checklist

## Required code-package assets

- [x] Final logo selected.
- [x] PNG extension icons exported at 16×16, 32×32, 48×48, and 128×128.
- [x] `manifest.json` contains the `icons` map.
- [x] Store ZIP has `manifest.json` at archive root.
- [x] ZIP contains only runtime files and extension icons; no source-control or store-document files.
- [x] JavaScript syntax, ZIP contents, version, and SHA256 validated.

## Microsoft Edge Add-ons

- [x] Individual or company account enrolled in the Microsoft Edge program.
- [x] Extension logo: square, recommended 300×300 PNG; minimum 128×128.
- [x] Full description: 250–10,000 characters.
- [x] Three clean 1280×800 screenshots prepared in `store/assets/`.
- [ ] Optional small promotional tile: 440×280 PNG.
- [ ] Optional large promotional tile: 1400×560 PNG.
- [x] Category: Productivity selected for submission.
- [x] Privacy, permission, remote-code, and data-use declarations prepared.
- [x] Certification notes prepared in `submission-notes.md`.
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
- Privacy policy: https://github.com/DBAA-LCT/lumoratab/blob/main/store/privacy-policy.md

## Remaining decisions

- Choose one logo direction and export final raster assets.
- [x] Third-party favicon fallbacks are opt-in or manually triggered and documented in the privacy policy.
- Decide whether online search suggestions should remain enabled by default or become opt-in.
