# Supported Browsers

mv3-forge generates browser extensions compatible with Manifest V3. This document outlines the officially supported browsers and their compatibility status.

## Officially Supported Browsers

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | >= 88 | ✅ Full Support | Primary development target |
| Chromium | >= 88 | ✅ Full Support | Includes Brave, Edge, Opera, etc. |
| Firefox | >= 109 | ✅ Full Support | Uses manifest.json with MV3 support |
| Firefox ESR | >= 109 | ✅ Full Support | Extended support release |

## Browser-Specific Features

### Chrome/Chromium
- Full Manifest V3 support
- Service workers for background scripts
- Action API (browser action)
- Content scripts with full permissions

### Firefox
- Manifest V3 support (since version 109)
- Background service workers
- Side panel support (planned)
- Manifest compatibility with Chrome

## Testing Browsers

When contributing to mv3-forge, please test extensions on the following browsers:

| Browser | Loading Extension | Debug Tools |
|---------|-------------------|-----------|
| Chrome | `chrome://extensions` | DevTools in extension pages |
| Firefox | `about:debugging` | Browser Toolbox |

## Version Requirements

- **Minimum Chrome/Chromium**: Version 88+ (Manifest V3 stable)
- **Minimum Firefox**: Version 109+ (Manifest V3 support)

## Edge Cases

### Chromium-based Browsers
All Chromium-based browsers (Brave, Edge, Opera, Vivaldi) should work with mv3-forge generated extensions, but may have variations in API support.

### Safari
Safari extension support is not currently planned. Safari uses App Store distribution which requires different tooling.

### Legacy Browsers
Internet Explorer and older browser versions are not supported. MV3 requires modern JavaScript features.

## Reporting Browser Compatibility Issues

If you encounter browser-specific issues:

1. Check the existing issues to avoid duplicates
2. Document the browser version and operating system
3. Include reproduction steps
4. Add screenshots or error messages if available

Label your issue with the appropriate browser tag.