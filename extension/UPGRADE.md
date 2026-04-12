# Upgrade Guide

## v0.9.0 to v1.0.0

Production release. No breaking changes.

## v0.5.1 to v0.6.0

### Webview Changes
- All webviews now show loading skeletons instead of empty forms on load.
- DOM updates are targeted (no more full `innerHTML` clears on state changes).
- Field input handlers in Record Editor are debounced.
- Virtualization threshold lowered from 250 to 50 rows in Query Builder.

### New Commands
- **FileMaker: Create Record** — opens Record Editor in create mode.
- **FileMaker: Delete Record** — delete with confirmation dialog.
- Both commands are blocked for `viewer` role and (delete) untrusted workspaces.

### CSS Changes
- All webviews use fluid `max-width`, `clamp()` font sizes, and fluid padding.
- Fixed `min-width` on tables replaced with horizontal scroll wrappers.
- ARIA attributes added (`aria-live="polite"`, `role="status"`).

### Testing
- Coverage reporting configured with `@vitest/coverage-v8`.
- CI runs `npm run test:coverage` instead of `npm test`.
- New `test:coverage` script in `package.json`.

### Dependencies
- `axios` bumped to 1.15.0 (security fixes).
- `next` bumped to 15.5.15 (security fix).
- `@vitest/coverage-v8` added as devDependency.

### No Required Setting Changes

All existing settings continue to work unchanged.

## v0.4.0 to v0.5.0

Hardening release. See [CHANGELOG.md](./CHANGELOG.md) for details.

- Prefer `SettingsService` for new config access.
- Use `showErrorWithDetails` / `showCommandError` in command handlers.
- Use `normalizeError` and `redact` utilities instead of local logic.
- Use `webviews/common/csp.ts` and `webviews/common/messageValidation.ts` for new webviews.
