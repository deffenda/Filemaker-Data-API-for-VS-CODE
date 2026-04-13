# Changelog

## Unreleased

- Added Marketplace-ready extension metadata:
  - real `publisher`, repository, homepage, and issue tracker URLs
  - Marketplace categories, keywords, icon, and gallery banner
- Rewrote the extension README for Marketplace publication:
  - product overview, install path, quick start, and feature highlights
  - repo-hosted screenshots for explorer, query builder, and schema/batch workflows
- Added a dedicated `package:vsix` script that emits the VSIX into `artifacts/`
- Updated CI tag packaging to publish the generated VSIX artifact instead of rebuilding ad hoc

## 1.0.0

Production release.

- Complete CRUD: find, get, create, edit, delete records
- Value list support with extraction and explorer integration
- Container field detection and URL resolution
- Portal data utilities with pagination parameters
- Global field support with payload builder/parser
- Compound find queries with omit support
- Duplicate record preparation with auto-enter field filtering
- 253 tests across 58 test files
- Coverage reporting with @vitest/coverage-v8
- Webview rendering stability (loading skeletons, targeted DOM updates, debouncing)
- Responsive CSS with fluid scaling and ARIA accessibility
- Enterprise role guards and workspace trust enforcement
- VS Code Marketplace publishing workflow in CI

## 0.9.0

- Global field support:
  - Added `buildGlobalFieldsPayload()` and `parseGlobalFieldsPayload()` utilities
  - Added `isValidGlobalFieldName()` validation
- Compound find support:
  - Added `buildCompoundFindQuery()` for multi-request finds with omit support
  - Added `parseCompoundFindQuery()` for parsing query arrays back to structured rows
  - Added `validateCompoundFind()` validation
- Duplicate record support:
  - Added `extractDuplicateFieldData()` and `prepareDuplicateFieldData()` utilities
  - Added `isLikelyAutoEnterField()` heuristic for excluding auto-enter fields
- Tests:
  - 10 global field tests, 7 compound find tests, 6 duplicate record tests
  - Total: 253 tests across 58 test files

## 0.8.0

- Portal support:
  - Added `extractPortals()` utility for structured portal data extraction from records
  - Added `extractPortalMetadata()` for parsing portal field metadata from layout info
  - Added `buildPortalParams()` for portal-aware find/get request parameters (limit, offset per portal)
  - Portal field names extracted and sorted, internal fields (recordId/modId) filtered
- Tests:
  - 12 portal utility tests (extraction, metadata, params, edge cases)
  - Total: 226 tests across 55 test files

## 0.7.0

- Value list support:
  - Added `ValueList` and `ValueListItem` types
  - Added `extractValueLists()` utility for parsing layout metadata
  - Value Lists group node in Explorer under each layout
  - Value list items displayed with item count
- Container field support:
  - Added `isContainerField()` utility for field type detection
  - Added `resolveContainerUrl()` for building full download URLs from relative paths
  - Added `isImageContainer()` for detecting image content types
- Tests:
  - 7 value list parser tests (extraction, edge cases, fallbacks)
  - 9 container field utility tests (detection, URL resolution, image detection)
  - Total: 214 tests across 54 test files

## 0.6.0

- Webview rendering stability:
  - Added loading skeleton states to all webviews (no more empty form flash)
  - Replaced full DOM rebuilds with targeted element updates in recordEditor, queryBuilder, recordViewer, scriptRunner
  - Added 200ms debounce to recordEditor field input handlers
  - Fixed layout thrashing in queryBuilder virtual table scroll handler (requestAnimationFrame)
  - Lowered virtualization threshold from 250 to 50 rows
  - Added fade-in transitions for schema diff sections
- Responsive CSS improvements:
  - Fluid max-width, clamp-based font sizing, fluid padding across all webviews
  - Removed fixed min-width on tables (horizontal scroll wrapper instead)
  - Added ARIA attributes for accessibility (aria-live, role=status)
- Test coverage expansion:
  - Added coverage reporting with @vitest/coverage-v8 and lcov output
  - Added ProxyClient unit tests (13 tests covering all public methods)
  - Added command handler tests (registration, common utils parsing)
  - Added webview HTML snapshot tests (CSP nonce, directives, DOM structure)
  - Added fmExplorer tree view tests (root nodes, profile children, refresh)
  - Added utility tests for errorUx, hash, jsonlWriter, csp
  - Added integration tests for createRecord and deleteRecord
  - Total: 191 tests across 52 test files
- Added Create Record support:
  - createRecord method in FMClient and ProxyClient
  - RecordEditor create mode (custom title, confirmation, success message with recordId)
  - FileMaker: Create Record command with layout picker
  - Explorer context menu on layout nodes
- Added Delete Record support:
  - deleteRecord method in FMClient and ProxyClient
  - FileMaker: Delete Record command with confirmation dialog
  - Deletion blocked for viewer role and untrusted workspaces
- Security:
  - Bumped axios 1.13.6 to 1.15.0 (SSRF and header injection fixes)
  - Bumped next 15.5.14 to 15.5.15 (DoS fix)
  - Added npm audit step to CI pipeline

## 0.5.1

- Fixed layout parsing for folder-based FileMaker layout payloads:
  - nested folder nodes are now flattened into selectable layout names
  - layouts under folders (for example `Assets`) now resolve correctly in Query Builder and Explorer
- Added tests for folder/nested layout parsing:
  - unit coverage for mixed layout structures
  - integration coverage for mocked `/layouts` folder responses
- Fixed VSIX packaging defaults:
  - removed `--no-dependencies` from package script to avoid missing runtime modules in installed VSIX files

## 0.5.0

- Quality/hardening release (no major new user-facing feature set).
- Added centralized settings service:
  - defaulting and validation/clamping for key settings
  - trust-aware defaults for snapshot storage/file output flows
- Added shared error infrastructure:
  - typed normalized error model (`src/types/errors.ts`)
  - shared `normalizeError()` utility
  - shared command error UX helper with `Details…` JSON document
- Added shared redaction utility and migrated logging call sites:
  - centralized token/password/header redaction
  - history/job/log pathways aligned on common redaction behavior
- Hardened webviews:
  - common CSP nonce builder
  - message validation helpers for inbound postMessage payloads
  - stricter CSP usage across webview surfaces
- Hardened data client behavior:
  - broader normalized error mapping (auth/server/network/timeout/cancellation)
  - cancellable proxy calls and improved propagation of abort signals
- Validation/sanitization improvements:
  - stronger profile input validation (URL/database/profile IDs)
  - safer output path/file-name handling for generated artifacts
- Testing expansion:
  - new unit tests for normalizeError, redact, settingsService, message validation
  - additional unit/integration coverage for fmClient headers and timeout/abort/non-JSON handling
- CI updates:
  - format check step
  - package validation step
  - stricter lint gate (`--max-warnings=0`)
- Documentation overhaul:
  - refreshed README and ARCHITECTURE
  - added CONTRIBUTING, SECURITY, UPGRADE guides

## 0.4.0

- Added enterprise governance foundations:
  - environment sets (`create/list/store`) for grouped profile workflows
  - cross-environment comparison service with layout presence matrix
  - layout diff across environments with field-level drift output
  - comparison export to JSON/Markdown
  - environment set explorer section and commands
- Added role-based feature controls:
  - `filemaker.enterprise.mode` and `filemaker.enterprise.role`
  - command-layer restriction enforcement (viewer/developer/admin)
  - locked profile handling via enterprise config policy
  - enterprise config parsing from `.vscode/filemaker.config.json`
- Added observability and diagnostics:
  - request tracing with `requestId`
  - rolling metrics store (latency, success/failure, re-auth, cache hit)
  - diagnostics dashboard webview
  - logger support for `filemaker.logging.level`
- Added high-scale performance hardening:
  - `filemaker.performance.mode`
  - high-scale batch export behavior (JSONL-first)
  - adaptive concurrency controller
  - retry/backoff for 429/5xx
  - circuit-breaker protection for repeated batch-update failures
- Added plugin architecture:
  - plugin contracts (`pluginTypes`)
  - plugin lifecycle and loading registry
  - internal + trusted workspace plugin loading
  - safe plugin API wrapper without SecretStorage exposure
  - plugin commands (`Reload Plugins`, `List Active Plugins`)
- Added offline metadata mode:
  - `filemaker.offline.mode`
  - persistent metadata cache store under `.vscode/filemaker/offline-metadata`
  - explorer offline badge
  - toggle offline mode and refresh cache commands
  - schema service cache fallback in offline mode
- Updated explorer structure:
  - `Environment Sets` root
  - `OFFLINE MODE` badge root item when enabled
- Expanded test coverage:
  - unit tests for role guard, environment compare, metrics, adaptive concurrency, circuit breaker, plugin registry, environment set store
  - integration tests for environment compare, offline mode, high-scale export behavior, role guard restrictions

## 0.3.0

- Added schema snapshots and schema diff workflows:
  - capture snapshots per profile/layout
  - workspaceState or workspace-files storage backend
  - diff two snapshots or diff current metadata vs latest snapshot
  - schema diff webview with added/removed/changed sections
  - optional Problems diagnostics publishing for drift detection
- Added type/snippet generation:
  - TypeScript layout artifacts generated into configurable output folder
  - field-name sanitization + mapping constants
  - metadata hash header for rerunnable generation traceability
  - VS Code snippet generation for find/get-record flows
- Added record editing write-back support:
  - new Record Editor webview
  - draft validation + dirty-state handling
  - preview patch JSON before save
  - partial update save via Data API edit endpoint
  - explicit save confirmation with rollback guidance
- Added batch operations + job runner:
  - batch find export with pagination (JSONL/CSV)
  - batch update from CSV/JSON with dry-run default
  - bounded concurrency execution and cancellation support
  - job progress/status tracking + status bar integration
  - persisted recent job summaries
- Hardening improvements:
  - improved cache keys (profile/database/api path aware)
  - best-effort ETag handling for metadata fetches
  - workspace trust gating for file-output and batch features
  - expanded settings surface for v0.3 features
- Added CI workflow:
  - npm install, lint, test, build
  - optional packaging step on tags
- Added tests:
  - unit tests for schema diff, name sanitize, type generation, job runner
  - integration tests for editRecord, snapshot+diff, batch export and batch update behavior

## 0.2.0

- Added Saved Queries v2:
  - workspace/global scope setting
  - schema versioning + migration from v0.1 format
  - run/open/manage/delete/export/import commands
  - explorer integration under profile nodes
- Added schema/field metadata browser:
  - `Fields` tree under layouts
  - metadata cache with TTL
  - graceful unsupported handling
  - refresh schema cache command
- Added Script Runner webview + command:
  - run scripts with layout/context inputs
  - copy as curl/fetch helpers
  - unsupported detection and UI guardrails
- Upgraded Query Builder:
  - load saved query defaults
  - save current query command integration
  - export JSON to editor/file and CSV to file
  - history panel
  - copy as curl/fetch with auth-inclusion toggle
- Added request history store + command (`Show Request History`)
- Added utilities:
  - JSON validation helper
  - CSV exporter
  - snippet generator with default auth redaction
- Added/expanded tests:
  - saved queries store
  - JSON validation
  - snippet redaction
  - CSV escaping
  - history ring buffer
  - schema metadata integration
  - script runner integration
  - saved query run integration

## 0.1.0

- Initial MVP release:
  - Connection profiles with secure secret handling
  - FileMaker Explorer tree view (profiles + layouts)
  - Query Builder and Record Viewer webviews
  - FileMaker Data API client with token lifecycle and 401 retry
  - Direct and proxy auth modes
  - Unit and integration tests (mocked HTTP)
