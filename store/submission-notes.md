# LumoraTab Submission Notes

## Single purpose

LumoraTab replaces the browser new tab page with a customizable start page that combines web search, user-managed site shortcuts, browser bookmarks, and wallpaper settings.

## Permission justifications

### `bookmarks`

Used only when the user opens the bookmark picker. It reads the browser bookmark tree so the user can search for and select a page to add as a shortcut. Bookmark data is not sent to the developer.

### `favicon`

Used to request site icons through the browser-provided `_favicon` endpoint for shortcuts displayed on the new tab page.

### `storage`

Stores search-engine selection, up to 10 local search-history entries, shortcuts and groups, customization settings, wallpaper data, and favicon source cache entries in `chrome.storage.local`.

### `topSites`

Used during initial setup when no saved shortcut list exists. Up to eight browser top sites become initial shortcuts. The data is not sent to the developer.

### `unlimitedStorage`

Allows users to save locally selected wallpaper images and icon files without failing at the standard extension storage quota. The data remains in extension-local storage.

### Host permissions

- `suggestqueries.google.com`: Google online search suggestions.
- `suggestion.baidu.com`: Baidu online search suggestions.
- `api.bing.com`: Bing online search suggestions.
- `cn.bing.com` and `www.bing.com`: Bing wallpaper metadata and images.

Requests are initiated only to provide the corresponding user-facing feature.

## Remote code declaration

**No.** LumoraTab does not download or execute remote JavaScript or WebAssembly. Remote responses are suggestion JSON, wallpaper metadata/images, and image resources only.

## Data-use declaration

- No developer-operated backend receives extension data.
- No advertising, analytics, tracking, sale of data, or creditworthiness use.
- Bookmark, top-site, shortcut, customization, and local history data remain on the device.
- Text entered into search is sent to the selected suggestion provider after a short debounce while online suggestions are active.
- Shortcut hostnames may be sent to third-party favicon providers only when the browser favicon API does not return a usable icon.
- Bing wallpaper mode requests metadata and images from Microsoft Bing.

## Certification test steps

1. Install the extension and open a new tab.
2. Confirm the new tab replacement loads and initial shortcuts are shown.
3. Enter at least two Latin characters or one Chinese character and confirm search suggestions appear.
4. Change the search provider between Google, Baidu, and Bing.
5. Add, edit, group, and remove a shortcut.
6. Open the bookmark picker and add one bookmark as a shortcut.
7. Open customization and test light/dark appearance.
8. Select Bing wallpaper mode, switch wallpaper, and test rotation options.
9. Select a local image as a custom wallpaper.
10. Close and reopen the new tab to confirm settings persist locally.

No login, paid account, test credential, native application, or external hardware is required.

## Reviewer clarification

LumoraTab is independently developed. Search-engine and Bing names identify optional user-selected services and do not imply sponsorship or affiliation.
