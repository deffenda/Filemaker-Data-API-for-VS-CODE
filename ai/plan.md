# Plan — v0.6.0: Hardening, Webview Stability, Test Coverage, Complete CRUD

## Overview

Hardening release focused on three pillars: (1) fix webview flickering and scaling, (2) build meaningful test coverage across untested layers, (3) complete CRUD with Create Record and Delete Record. This is an open-source, free connector — it must perform well out of the box.

---

## Phase 1: Webview Rendering Fixes (Flickering & Scaling)

Root causes of flickering: every state change wipes the DOM with `innerHTML = ''` and rebuilds from scratch. No loading states, no debouncing, layout thrashing in scroll handlers.

### 1A: Add loading skeleton states to all webviews

All webviews currently show empty dropdowns and blank forms until postMessage data arrives, causing a visual "pop." Add a CSS loading skeleton that displays immediately and is replaced when data arrives.

**Files:** All 6 webview `ui/index.js` files + all 6 `ui/styles.css` files.

### 1B: Replace innerHTML clears with targeted DOM updates in recordEditor

The Record Editor is the worst offender. Replace `fieldEditor.innerHTML = ''` full-table rebuilds with field-level updates that only touch changed cells. Add 200ms debounce to input change handlers so `markDirtyState()` does not fire on every keystroke.

**Files:** `src/webviews/recordEditor/ui/index.js`

### 1C: Replace innerHTML clears with targeted DOM updates in queryBuilder

Replace full select/table rebuilds with incremental DOM updates. Fix the virtualized table scroll handler to use `requestAnimationFrame` instead of synchronous read-write cycles that cause layout thrashing. Lower the virtualization threshold from 250 to 50 rows.

**Files:** `src/webviews/queryBuilder/ui/index.js`

### 1D: Replace innerHTML clears with targeted DOM updates in remaining webviews

Apply the same targeted-update pattern to recordViewer, scriptRunner, schemaDiff, and environmentCompare webviews. Each should update only changed content rather than clearing and rebuilding.

**Files:** `src/webviews/recordViewer/ui/index.js`, `src/webviews/scriptRunner/ui/index.js`, `src/webviews/schemaDiff/ui/index.js`, `src/webviews/environmentCompare/ui/index.js` (if applicable)

### 1E: Responsive CSS improvements

Fix scaling issues across all webview stylesheets:
- Replace fixed `max-width: 1200px` with fluid `max-width: min(1200px, 95vw)`
- Add `clamp()` for font sizes that scale between breakpoints
- Remove `min-width: 600px` on tables — use horizontal scroll wrapper instead
- Add `aria-live="polite"` to status message containers
- Add proper `role` attributes to dynamic content areas

**Files:** All 6 `ui/styles.css` files, all 6 webview controller `index.ts` files (for aria attributes in generated HTML)

---

## Phase 2: Test Infrastructure & Coverage

### 2A: Configure coverage reporting

Add coverage configuration to vitest.config.ts with `@vitest/coverage-v8`. Add coverage thresholds to CI. Generate lcov reports.

**Files:** `vitest.config.ts`, `package.json` (devDependency), `.github/workflows/ci.yml`

### 2B: ProxyClient unit tests

ProxyClient is 150+ lines with 7 methods and zero tests. Add unit tests with nock mocking for all methods: createSession, deleteSession, listLayouts, getRecord, findRecords, editRecord, runScript.

**Files:** `test/unit/proxyClient.test.ts` (new)

### 2C: Command handler tests — core commands

Test the command registration and execution flow for core commands: addConnectionProfile, editConnectionProfile, removeConnectionProfile, connect, disconnect. Mock VS Code window APIs (showInputBox, showQuickPick, showInformationMessage) and verify the command handlers call the correct service methods.

**Files:** `test/unit/commands/core.test.ts` (new)

### 2D: Command handler tests — data commands

Test command handlers for: runFindJson, getRecordById, openQueryBuilder, openRecordViewer, openRecordEditor. Verify argument validation, profile/layout selection flow, and error handling.

**Files:** `test/unit/commands/data.test.ts` (new)

### 2E: Command handler tests — feature commands

Test command handlers for: batch export/update, saved query run, schema snapshot, type generation, script runner, delete record, create record. Verify role guard enforcement and workspace trust checks.

**Files:** `test/unit/commands/features.test.ts` (new)

### 2F: Webview HTML output snapshot tests

Add snapshot tests that call `getHtmlForWebview` (or equivalent) on each webview panel class and assert the generated HTML structure. This catches unintended changes to webview markup. Test each webview: queryBuilder, recordEditor, recordViewer, scriptRunner, schemaDiff, environmentCompare, diagnosticsDashboard.

**Files:** `test/unit/webviews/htmlSnapshots.test.ts` (new)

### 2G: fmExplorer tree view tests

Test the tree data provider: getTreeItem, getChildren for each node type (profile, layout, field, saved query, snapshot, job, environment set). Verify correct icon, contextValue, and collapse state.

**Files:** `test/unit/views/fmExplorer.test.ts` (new)

### 2H: Missing utility tests

Add tests for untested utils: `errorUx.ts`, `hash.ts`, `jsonlWriter.ts`, and `csp.ts`.

**Files:** `test/unit/errorUx.test.ts` (new), `test/unit/hash.test.ts` (new), `test/unit/jsonlWriter.test.ts` (new), `test/unit/csp.test.ts` (new)

---

## Phase 3: Complete CRUD (Create Record & Delete Record)

### 3A: Add types for create and delete operations

Add `CreateRecordResult`, `DeleteRecordResult` to `src/types/fm.ts`. Add `DataApiCreateRecordResponse`, `DataApiDeleteRecordResponse` to `src/types/dataApi.ts`.

**Files:** `src/types/fm.ts`, `src/types/dataApi.ts`

### 3B: Add createRecord and deleteRecord to FMClient

Add `createRecord(profile, layout, fieldData, control?)` — POST to `layouts/{layout}/records`. Add `deleteRecord(profile, layout, recordId, control?)` — DELETE to `layouts/{layout}/records/{recordId}`. Follow existing editRecord patterns for error normalization, history, metrics.

**Files:** `src/services/fmClient.ts`

### 3C: Add createRecord and deleteRecord to ProxyClient

Add proxy passthrough methods following existing patterns.

**Files:** `src/services/proxyClient.ts`

### 3D: Integration tests for create and delete

Mocked HTTP tests for both success and error paths.

**Files:** `test/integration/createRecord.integration.test.ts` (new), `test/integration/deleteRecord.integration.test.ts` (new)

### 3E: Register commands and wire UI

Register `createRecord` and `deleteRecord` commands. Extend RecordEditor for create mode. Add delete confirmation dialog. Apply role guard and workspace trust. Add explorer context menu items.

**Files:** `src/commands/index.ts`, `src/webviews/recordEditor/index.ts`, `src/views/fmExplorer.ts`, `package.json`

---

## Phase 4: Final Validation

### 4A: Full CI pass and version bump

Run lint, typecheck, test (with coverage), build. Bump to 0.6.0. Update CHANGELOG.md.

**Files:** `package.json`, `CHANGELOG.md`
