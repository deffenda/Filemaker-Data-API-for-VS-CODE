# Tasks — v0.6.0

---

## Task 1: Add loading skeleton states to all webviews

**Status:** done
**Phase:** 1A
**Depends on:** none
**Files to modify:**
- `src/webviews/queryBuilder/ui/index.js`
- `src/webviews/queryBuilder/ui/styles.css`
- `src/webviews/recordEditor/ui/index.js`
- `src/webviews/recordEditor/ui/styles.css`
- `src/webviews/recordViewer/ui/index.js`
- `src/webviews/recordViewer/ui/styles.css`
- `src/webviews/scriptRunner/ui/index.js`
- `src/webviews/scriptRunner/ui/styles.css`
- `src/webviews/schemaDiff/ui/index.js`
- `src/webviews/schemaDiff/ui/styles.css`

**Instructions:**

1. Read each webview `ui/styles.css` and `ui/index.js` file fully.

2. Add a shared loading skeleton CSS class to each `styles.css`:
```css
.loading-skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
}
.loading-skeleton .skeleton-line {
  height: 16px;
  background: var(--vscode-editor-inactiveSelectionBackground, #e0e0e0);
  border-radius: 4px;
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}
.loading-skeleton .skeleton-line.short { width: 40%; }
.loading-skeleton .skeleton-line.medium { width: 65%; }
.loading-skeleton .skeleton-line.long { width: 90%; }
@keyframes skeleton-pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}
.loading-skeleton.hidden { display: none; }
```

3. In each `ui/index.js`, at the top of the `DOMContentLoaded` handler:
   - Find the main content container element.
   - Insert a loading skeleton before it (3-5 skeleton lines matching the layout: short, medium, long).
   - Set the main content area to `display: none` initially.
   - When the first `init` or data message arrives via `window.addEventListener('message', ...)`, hide the skeleton and show the content area.

4. Pattern for each webview:
   - queryBuilder: skeleton shown until `init` message populates profiles/layouts
   - recordEditor: skeleton shown until `loadRecord` message provides field data
   - recordViewer: skeleton shown until `showRecord` message provides record data
   - scriptRunner: skeleton shown until `init` message populates profiles
   - schemaDiff: skeleton shown until `showDiff` message provides diff data

5. Run `npm run lint` — must pass.

---

## Task 2: Fix recordEditor flickering — targeted DOM updates and debounce

**Status:** ready_for_review
**Phase:** 1B
**Depends on:** Task 1 (done, merged to main)
**Files to modify:**
- `src/webviews/recordEditor/ui/index.js`

**Instructions:**

1. Read `src/webviews/recordEditor/ui/index.js` fully.

2. Replace the `fieldEditor.innerHTML = ''` pattern with targeted updates:
   - On initial render, build the field table once and store references to each field's `<textarea>` element in a `Map<string, HTMLTextAreaElement>`.
   - On subsequent data updates (e.g., discard draft), iterate the map and update only the `value` property of each textarea. Do not rebuild the table.

3. Add debouncing to field change handlers:
   - Create a `debounce(fn, ms)` utility at the top of the file:
     ```javascript
     function debounce(fn, ms) {
       let timer;
       return function(...args) {
         clearTimeout(timer);
         timer = setTimeout(() => fn.apply(this, args), ms);
       };
     }
     ```
   - Wrap the `markDirtyState()` call in `debounce(markDirtyState, 200)`.
   - Apply the debounced version to all field textarea `input` event listeners (change `'change'` to `'input'` for better responsiveness, but debounced).

4. Ensure the "Discard" button still works: it should update textarea values via the stored map, not rebuild the table.

5. Run `npm run lint` — must pass.

---

## Task 3: Complete webview stability — queryBuilder, remaining views, and responsive CSS

**Status:** pending
**Phase:** 1C–1E
**Depends on:** Task 1
**Files to modify:**
- `src/webviews/queryBuilder/ui/index.js`
- `src/webviews/recordViewer/ui/index.js`
- `src/webviews/scriptRunner/ui/index.js`
- `src/webviews/schemaDiff/ui/index.js`
- `src/webviews/queryBuilder/ui/styles.css`
- `src/webviews/recordEditor/ui/styles.css`
- `src/webviews/recordViewer/ui/styles.css`
- `src/webviews/scriptRunner/ui/styles.css`
- `src/webviews/schemaDiff/ui/styles.css`
- `src/webviews/queryBuilder/index.ts`
- `src/webviews/recordEditor/index.ts`
- `src/webviews/recordViewer/index.ts`
- `src/webviews/scriptRunner/index.ts`
- `src/webviews/schemaDiff/index.ts`

**Instructions:**

### Part A — Fix queryBuilder flickering

1. Read `src/webviews/queryBuilder/ui/index.js` fully.

2. Fix profile and layout select rebuilds:
   - Instead of `innerHTML = ''` followed by rebuilding all `<option>` elements, diff the current options against the new list.
   - Only add new options and remove stale ones. Preserve the selected value if it still exists.

3. Fix the virtualized table scroll handler (the `renderSlice` function):
   - Wrap the entire `renderSlice` function body in `requestAnimationFrame`:
     ```javascript
     let rafPending = false;
     container.addEventListener('scroll', () => {
       if (!rafPending) {
         rafPending = true;
         requestAnimationFrame(() => {
           rafPending = false;
           renderSlice();
         });
       }
     });
     ```
   - This prevents layout thrashing from synchronous read-write cycles on every scroll event.

4. Lower the virtualization threshold from 250 to 50 rows so smaller result sets also benefit.

5. For the results table (non-virtualized path for < 50 rows), replace `innerHTML = ''` with targeted row updates where possible.

### Part B — Fix remaining webview flickering

6. Read `src/webviews/recordViewer/ui/index.js`, `src/webviews/scriptRunner/ui/index.js`, and `src/webviews/schemaDiff/ui/index.js` fully.

7. **recordViewer/ui/index.js:**
   - Replace `fieldDataContainer.innerHTML = ''` and `relatedDataContainer.innerHTML = ''` with targeted updates.
   - On first record load, build the field table and store cell references. On subsequent loads, update cell text content.
   - For portal data, only rebuild the portal section if the portal keys have changed. Otherwise update values in place.

8. **scriptRunner/ui/index.js:**
   - Replace profile select `innerHTML = ''` rebuild with diff-based update (add new options, remove stale, preserve selection).
   - Result display area can still use innerHTML since it only updates on explicit "Run" action (not continuous).

9. **schemaDiff/ui/index.js:**
   - The `renderSimpleTable` and `renderChanged` functions clear containers with `innerHTML = ''`. Since schema diffs are loaded once (not continuously updated), this is acceptable. Add a fade-in CSS transition instead:
     ```css
     .diff-section { opacity: 0; transition: opacity 0.15s ease-in; }
     .diff-section.loaded { opacity: 1; }
     ```
   - After populating the container, add the `loaded` class.

### Part C — Responsive CSS and ARIA across all webviews

10. In each `styles.css`:
    - Replace `.container { max-width: 1200px; }` with `.container { max-width: min(1200px, 95vw); }` (the max-width value varies per file — some use 1100px).
    - Replace fixed font sizes with clamp: `font-size: clamp(0.8rem, 0.85rem + 0.1vw, 0.95rem);` for body text, `font-size: clamp(1.1rem, 1.2rem + 0.15vw, 1.5rem);` for headings.
    - Remove any `min-width` on tables. Wrap tables in a `<div class="table-scroll-wrapper">` with `overflow-x: auto;`.
    - Add fluid padding: replace fixed `padding: 18px;` with `padding: clamp(12px, 2vw, 24px);`.

11. In each webview controller `index.ts` (in the HTML template method):
    - Add `aria-live="polite"` to the status/message container element.
    - Add `role="status"` to status message areas.
    - Add `role="table"` and appropriate `role="row"`, `role="cell"` if tables are built with `<div>` elements (if they use `<table>` elements, these are implicit).

12. Run `npm run lint` and `npm run typecheck` — must pass.

---

## Task 4: Full test coverage suite — coverage reporting, all untested layers

**Status:** pending
**Phase:** 2A–2H
**Depends on:** none
**Files to modify/create:**
- `vitest.config.ts`
- `package.json`
- `.github/workflows/ci.yml`
- `test/unit/proxyClient.test.ts` (create)
- `test/unit/commands/core.test.ts` (create)
- `test/unit/commands/data.test.ts` (create)
- `test/unit/commands/features.test.ts` (create)
- `test/unit/webviews/htmlSnapshots.test.ts` (create)
- `test/unit/views/fmExplorer.test.ts` (create)
- `test/unit/errorUx.test.ts` (create)
- `test/unit/hash.test.ts` (create)
- `test/unit/jsonlWriter.test.ts` (create)
- `test/unit/csp.test.ts` (create)

**Instructions:**

### Part A — Coverage reporting setup

1. Install `@vitest/coverage-v8` as a devDependency:
   - Add `"@vitest/coverage-v8": "^3.0.0"` to `devDependencies` in `package.json` (match the major version of the installed vitest).

2. In `vitest.config.ts`, add coverage configuration:
```typescript
coverage: {
  provider: 'v8',
  reporter: ['text', 'lcov'],
  reportsDirectory: './coverage',
  include: ['src/**/*.ts'],
  exclude: ['src/**/*.d.ts', 'src/webviews/*/ui/**'],
}
```

3. Add `"test:coverage": "vitest run --coverage"` script to `package.json`.

4. Add `coverage/` to `.gitignore` if not already present.

5. In `.github/workflows/ci.yml`, change the test step from `npm test` to `npm run test:coverage`.

### Part B — ProxyClient unit tests

6. Read `src/services/proxyClient.ts` fully to understand all methods and their behavior.

7. Create `test/unit/proxyClient.test.ts` following the patterns in existing test files (use nock for HTTP mocking, use the `InMemorySecretStorage` mock from `test/unit/mocks.ts`).

8. Test each public method:
   - `createSession()` — success path, error path
   - `deleteSession()` — success path
   - `listLayouts()` — success path
   - `getRecord()` — success path, record-not-found error
   - `findRecords()` — success path
   - `editRecord()` — success path, validation error
   - `runScript()` — success path

### Part C — Command handler tests

9. Read `src/commands/index.ts` fully (focus on addConnectionProfile, editConnectionProfile, removeConnectionProfile, connect, disconnect handlers).

10. Create `test/unit/commands/core.test.ts`:
    - Mock `vscode.window.showInputBox`, `showQuickPick`, `showWarningMessage`, ProfileStore, SecretStore, FMClient with `vi.fn()` methods.
    - Test: `addConnectionProfile` (profileStore.add called with validated input), `editConnectionProfile` (showQuickPick called, profileStore.update called), `removeConnectionProfile` (confirmation shown, profileStore.remove called), `connect` (FMClient session created), `disconnect` (FMClient session closed).

11. Read batch.ts, recordEdit.ts, savedQueries.ts, schema.ts, schemaSnapshots.ts, scriptRunner.ts, typeGen.ts, enterprise.ts in `src/commands/`.

12. Create `test/unit/commands/data.test.ts`:
    - Test runFindJson, getRecordById, openQueryBuilder, openRecordViewer, openRecordEditor.

13. Create `test/unit/commands/features.test.ts`:
    - Test batch export, saved query run, schema snapshot capture, type generation, and role guard enforcement (mock role as 'viewer', verify write commands are blocked).

### Part D — Webview HTML snapshot tests

14. Read each webview controller's `index.ts` to find the HTML generation method.

15. Create `test/unit/webviews/htmlSnapshots.test.ts`:
    - For each webview, extract or call the HTML generation with mocked VS Code webview/URI objects.
    - Use `expect(html).toMatchSnapshot()` to create a baseline.
    - Assert: CSP header present, nonce in script/style tags, required DOM elements exist by ID, no inline event handlers.
    - Webviews to cover: queryBuilder, recordEditor, recordViewer, scriptRunner, schemaDiff, environmentCompare.

### Part E — Tree view and utility tests

16. Read `src/views/fmExplorer.ts` fully.

17. Create `test/unit/views/fmExplorer.test.ts`:
    - Mock: ProfileStore, FMClient, SchemaSnapshotStore, SavedQueriesStore, JobRunner, EnvironmentSetStore.
    - Test tree structure: getChildren(undefined) returns profile root nodes, getChildren(profileNode) returns layout group / saved queries group / snapshots group, getChildren(layoutGroupNode) returns layout items, each tree item has correct label/contextValue/collapsibleState/iconPath.
    - Test refresh(): fires the `onDidChangeTreeData` event.

18. Read `src/utils/errorUx.ts`, `src/utils/hash.ts`, `src/utils/jsonlWriter.ts`, `src/webviews/common/csp.ts`.

19. Create utility tests:
    - `test/unit/errorUx.test.ts`: test that `showCommandError` calls `vscode.window.showErrorMessage` with correct format, test the "Details" action opens a JSON document.
    - `test/unit/hash.test.ts`: test deterministic hashing of metadata objects, test empty input handling.
    - `test/unit/jsonlWriter.test.ts`: test writing multiple records to JSONL format, test special character escaping, test empty array.
    - `test/unit/csp.test.ts`: test `createNonce()` returns 32-char alphanumeric string, test `buildWebviewCsp()` includes correct directives, test nonce is embedded in policy string.

20. Run `npm test` — all tests must pass.

---

## Task 5: Complete CRUD — types, FMClient/ProxyClient, integration tests, commands, and UI

**Status:** pending
**Phase:** 3A–3E
**Depends on:** none
**Files to modify/create:**
- `src/types/fm.ts`
- `src/types/dataApi.ts`
- `src/services/fmClient.ts`
- `src/services/proxyClient.ts`
- `test/integration/createRecord.integration.test.ts` (create)
- `test/integration/deleteRecord.integration.test.ts` (create)
- `package.json`
- `src/commands/index.ts`
- `src/webviews/recordEditor/index.ts`
- `src/views/fmExplorer.ts`

**Instructions:**

### Part A — Types

1. In `src/types/fm.ts`, add after the `EditRecordResult` interface:
```typescript
export interface CreateRecordResult {
  recordId: string;
  modId?: string;
  messages: FileMakerMessage[];
  response: Record<string, unknown>;
}

export interface DeleteRecordResult {
  messages: FileMakerMessage[];
  response: Record<string, unknown>;
}
```

2. In `src/types/dataApi.ts`, add response envelope types:
```typescript
export interface DataApiCreateRecordResponse {
  recordId: string;
  modId: string;
}

export interface DataApiDeleteRecordResponse {
  [key: string]: unknown;
}
```

### Part B — FMClient and ProxyClient methods

3. Read `src/services/fmClient.ts` — study the `editRecord` method as the template.

4. Add `createRecord` to FMClient:
   - Signature: `async createRecord(profile: ConnectionProfile, layout: string, fieldData: Record<string, unknown>, control?: ClientRequestControl): Promise<CreateRecordResult>`
   - Validate fieldData is non-empty (throw FMClientError if empty)
   - POST to `layouts/${encodeURIComponent(layout)}/records` with body `{ fieldData }`
   - Use `requestWithAuth` for retry-on-401
   - Record history (operation: `'createRecord'`) and metrics
   - Return `{ recordId, modId, messages, response }` from envelope

5. Add `deleteRecord` to FMClient:
   - Signature: `async deleteRecord(profile: ConnectionProfile, layout: string, recordId: string, control?: ClientRequestControl): Promise<DeleteRecordResult>`
   - Validate recordId is non-empty string (throw FMClientError if empty)
   - DELETE to `layouts/${encodeURIComponent(layout)}/records/${encodeURIComponent(recordId)}`
   - Use `requestWithAuth` for retry-on-401
   - Record history (operation: `'deleteRecord'`) and metrics
   - Return `{ messages, response }` from envelope

6. Read `src/services/proxyClient.ts` — add proxy passthrough methods for both, following the existing editRecord pattern.

7. Run `npm run lint` and `npm run typecheck` — must pass.

### Part C — Integration tests

8. Follow the patterns in `test/integration/fmClient.integration.test.ts`.

9. Create `test/integration/createRecord.integration.test.ts`:
   - Mock POST to `/fmi/data/vLatest/databases/{db}/sessions` for auth
   - Mock POST to `/fmi/data/vLatest/databases/{db}/layouts/{layout}/records` returning `{ response: { recordId: "42", modId: "1" }, messages: [{ code: "0", message: "OK" }] }`
   - Test success: assert result.recordId === "42"
   - Test validation: empty fieldData throws FMClientError
   - Test 401 retry: first call returns 401, re-auth, second call succeeds

10. Create `test/integration/deleteRecord.integration.test.ts`:
    - Mock DELETE to `/fmi/data/vLatest/databases/{db}/layouts/{layout}/records/42` returning `{ response: {}, messages: [{ code: "0", message: "OK" }] }`
    - Test success: assert result.messages present
    - Test validation: empty recordId throws FMClientError
    - Test 404: mock 404 response, assert appropriate error

11. Run `npm test` — all tests must pass.

### Part D — Commands, RecordEditor create mode, explorer menus

12. In `package.json`:
    - Add commands: `filemakerDataApiTools.createRecord` ("FileMaker: Create Record"), `filemakerDataApiTools.deleteRecord` ("FileMaker: Delete Record")
    - Add both to `activationEvents`
    - Add context menu items under `contributes.menus.view/item/context`: Create Record on layout nodes, Delete Record if record-level context exists

13. In `src/commands/index.ts`:
    - Register `createRecord`: pick profile -> pick layout -> open RecordEditor in create mode
    - Register `deleteRecord`: accept (layout, recordId) or prompt -> show warning confirmation -> call fmClient.deleteRecord -> show result
    - Apply role guard: viewer blocked from both
    - Apply workspace trust: delete blocked in untrusted workspaces

14. In `src/webviews/recordEditor/index.ts`:
    - Add `mode: 'edit' | 'create'` parameter to `createOrShow` (default `'edit'`)
    - In create mode: title = "Create Record — {layout}", empty field data, no recordId
    - On save in create mode: call `fmClient.createRecord` instead of `editRecord`
    - On success: show info message with recordId

15. In `src/views/fmExplorer.ts`: verify layout nodes have correct `contextValue` for menu binding.

16. Run `npm run lint`, `npm run typecheck`, `npm test` — all must pass.

---

## Task 6: Final CI pass and v0.6.0 release

**Status:** pending
**Phase:** 4A
**Depends on:** all previous tasks
**Files to modify:**
- `package.json`
- `CHANGELOG.md`

**Instructions:**

1. Run: `npm run lint && npm run typecheck && npm test && npm run build`
2. Fix any failures.
3. Bump `package.json` version from `"0.5.1"` to `"0.6.0"`.
4. Add to top of `CHANGELOG.md`:

```
## 0.6.0

- Webview rendering stability:
  - Added loading skeleton states to all webviews (no more empty form flash)
  - Replaced full DOM rebuilds with targeted element updates in recordEditor, queryBuilder, recordViewer, scriptRunner
  - Added 200ms debounce to recordEditor field input handlers
  - Fixed layout thrashing in queryBuilder virtual table scroll handler (requestAnimationFrame)
  - Lowered virtualization threshold from 250 to 50 rows
  - Added fade-in transitions for schema diff sections
- Responsive CSS improvements:
  - Fluid max-width, clamp-based font sizing, fluid padding
  - Removed fixed min-width on tables (horizontal scroll wrapper instead)
  - Added ARIA attributes for accessibility (aria-live, role)
- Test coverage expansion:
  - Added coverage reporting with @vitest/coverage-v8
  - Added ProxyClient unit tests
  - Added command handler tests (core, data, feature commands)
  - Added webview HTML snapshot tests
  - Added fmExplorer tree view tests
  - Added utility tests for errorUx, hash, jsonlWriter, csp
- Added Create Record support:
  - createRecord method in FMClient and ProxyClient
  - RecordEditor create mode (empty form, save creates new record)
  - FileMaker: Create Record command with layout picker
  - Explorer context menu on layout nodes
- Added Delete Record support:
  - deleteRecord method in FMClient and ProxyClient
  - FileMaker: Delete Record command with confirmation dialog
  - Deletion blocked for viewer role and untrusted workspaces
- Added types: CreateRecordResult, DeleteRecordResult, DataApi envelope types
- Integration tests for create and delete round trips
```

5. Run: `npm run lint && npm run typecheck && npm test && npm run build` — all must pass.
