# Tasks — v0.6.0

---

## Task 1: Add loading skeleton states to all webviews

**Status:** ready_for_review
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

**Status:** pending
**Phase:** 1B
**Depends on:** Task 1
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

## Task 3: Fix queryBuilder flickering — targeted updates and scroll fix

**Status:** pending
**Phase:** 1C
**Depends on:** Task 1
**Files to modify:**
- `src/webviews/queryBuilder/ui/index.js`

**Instructions:**

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

6. Run `npm run lint` — must pass.

---

## Task 4: Fix remaining webview flickering — recordViewer, scriptRunner, schemaDiff

**Status:** pending
**Phase:** 1D
**Depends on:** Task 1
**Files to modify:**
- `src/webviews/recordViewer/ui/index.js`
- `src/webviews/scriptRunner/ui/index.js`
- `src/webviews/schemaDiff/ui/index.js`

**Instructions:**

1. Read each file fully.

2. **recordViewer/ui/index.js:**
   - Replace `fieldDataContainer.innerHTML = ''` and `relatedDataContainer.innerHTML = ''` with targeted updates.
   - On first record load, build the field table and store cell references. On subsequent loads, update cell text content.
   - For portal data, only rebuild the portal section if the portal keys have changed. Otherwise update values in place.

3. **scriptRunner/ui/index.js:**
   - Replace profile select `innerHTML = ''` rebuild with diff-based update (add new options, remove stale, preserve selection).
   - Result display area can still use innerHTML since it only updates on explicit "Run" action (not continuous).

4. **schemaDiff/ui/index.js:**
   - The `renderSimpleTable` and `renderChanged` functions clear containers with `innerHTML = ''`. Since schema diffs are loaded once (not continuously updated), this is acceptable. Add a fade-in CSS transition instead:
     ```css
     .diff-section { opacity: 0; transition: opacity 0.15s ease-in; }
     .diff-section.loaded { opacity: 1; }
     ```
   - After populating the container, add the `loaded` class.

5. Run `npm run lint` — must pass.

---

## Task 5: Responsive CSS improvements across all webviews

**Status:** pending
**Phase:** 1E
**Depends on:** Task 1
**Files to modify:**
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

1. In each `styles.css`:
   - Replace `.container { max-width: 1200px; }` with `.container { max-width: min(1200px, 95vw); }` (or equivalent per file — the max-width value varies, some use 1100px).
   - Replace fixed font sizes with clamp: `font-size: clamp(0.8rem, 0.85rem + 0.1vw, 0.95rem);` for body text, `font-size: clamp(1.1rem, 1.2rem + 0.15vw, 1.5rem);` for headings.
   - Remove any `min-width` on tables. Wrap tables in a `<div class="table-scroll-wrapper">` with `overflow-x: auto;`.
   - Add fluid padding: replace fixed `padding: 18px;` with `padding: clamp(12px, 2vw, 24px);`.

2. In each webview controller `index.ts` (in the HTML template method):
   - Add `aria-live="polite"` to the status/message container element.
   - Add `role="status"` to status message areas.
   - Add `role="table"` and appropriate `role="row"`, `role="cell"` if tables are built with `<div>` elements (if they use `<table>` elements, these are implicit).

3. Run `npm run lint` and `npm run typecheck` — must pass.

---

## Task 6: Configure coverage reporting in vitest and CI

**Status:** pending
**Phase:** 2A
**Depends on:** none
**Files to modify:**
- `vitest.config.ts`
- `package.json`
- `.github/workflows/ci.yml`

**Instructions:**

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

6. Run `npm run lint` and `npm run typecheck` — must pass.

---

## Task 7: Add ProxyClient unit tests

**Status:** pending
**Phase:** 2B
**Depends on:** none
**Files to create:**
- `test/unit/proxyClient.test.ts`

**Instructions:**

1. Read `src/services/proxyClient.ts` fully to understand all methods and their behavior.

2. Create `test/unit/proxyClient.test.ts` following the patterns in existing test files (use nock for HTTP mocking, use the `InMemorySecretStorage` mock from `test/unit/mocks.ts`).

3. Test each public method:
   - `createSession()` — success path, error path
   - `deleteSession()` — success path
   - `listLayouts()` — success path
   - `getRecord()` — success path, record-not-found error
   - `findRecords()` — success path
   - `editRecord()` — success path, validation error
   - `runScript()` — success path

4. For each test: mock the proxy endpoint URL, assert the correct HTTP method and path, assert the response is correctly mapped.

5. Run `npm test` — all tests must pass.

---

## Task 8: Add command handler tests — core profile and connection commands

**Status:** pending
**Phase:** 2C
**Depends on:** none
**Files to create:**
- `test/unit/commands/core.test.ts`

**Instructions:**

1. Read `src/commands/index.ts` fully (focus on addConnectionProfile, editConnectionProfile, removeConnectionProfile, connect, disconnect handlers).

2. Create `test/unit/commands/core.test.ts`.

3. Mock dependencies:
   - `vscode.window.showInputBox` — return canned values for profile fields
   - `vscode.window.showQuickPick` — return selected profile
   - `vscode.window.showWarningMessage` — return confirmation
   - ProfileStore — mock with vi.fn() methods
   - SecretStore — mock with vi.fn() methods
   - FMClient — mock with vi.fn() methods

4. Test each command:
   - `addConnectionProfile`: verify profileStore.add is called with validated input
   - `editConnectionProfile`: verify showQuickPick is called, profileStore.update is called
   - `removeConnectionProfile`: verify confirmation dialog shown, profileStore.remove called
   - `connect`: verify FMClient session is created
   - `disconnect`: verify FMClient session is closed

5. Run `npm test` — all tests must pass.

---

## Task 9: Add command handler tests — data and feature commands

**Status:** pending
**Phase:** 2D/2E
**Depends on:** Task 8
**Files to create:**
- `test/unit/commands/data.test.ts`
- `test/unit/commands/features.test.ts`

**Instructions:**

1. Read the relevant command files in `src/commands/` (batch.ts, recordEdit.ts, savedQueries.ts, schema.ts, schemaSnapshots.ts, scriptRunner.ts, typeGen.ts, enterprise.ts).

2. Create `test/unit/commands/data.test.ts`:
   - Test runFindJson: verify layout pick, JSON input, fmClient.findRecords called
   - Test getRecordById: verify recordId input, fmClient.getRecord called
   - Test openQueryBuilder: verify panel creation
   - Test openRecordViewer: verify panel creation with record data
   - Test openRecordEditor: verify panel creation with record data

3. Create `test/unit/commands/features.test.ts`:
   - Test batch export command: verify layout pick, output path, batchService called
   - Test saved query run: verify query selection, execution
   - Test schema snapshot capture: verify profile/layout pick, snapshotStore called
   - Test type generation: verify typeGenService called
   - Test role guard enforcement: mock enterprise role as 'viewer', verify write commands are blocked

4. Run `npm test` — all tests must pass.

---

## Task 10: Add webview HTML snapshot tests

**Status:** pending
**Phase:** 2F
**Depends on:** none
**Files to create:**
- `test/unit/webviews/htmlSnapshots.test.ts`

**Instructions:**

1. Read each webview controller's `index.ts` to find the method that generates HTML (typically a private `getHtmlForWebview` or inline template in the constructor).

2. Create `test/unit/webviews/htmlSnapshots.test.ts`.

3. For each webview, extract or call the HTML generation with mocked VS Code webview/URI objects. Use `expect(html).toMatchSnapshot()` to create a baseline.

4. If the HTML generation is tightly coupled to the panel instance, test the key portions:
   - CSP header is present and correct
   - Nonce is included in script and style tags
   - Required DOM elements exist (by ID)
   - No inline event handlers (onclick, etc.)

5. Webviews to cover: queryBuilder, recordEditor, recordViewer, scriptRunner, schemaDiff, environmentCompare.

6. Run `npm test` — all tests must pass. Snapshot files will be created in `test/unit/webviews/__snapshots__/`.

---

## Task 11: Add fmExplorer tree view tests

**Status:** pending
**Phase:** 2G
**Depends on:** none
**Files to create:**
- `test/unit/views/fmExplorer.test.ts`

**Instructions:**

1. Read `src/views/fmExplorer.ts` fully.

2. Create `test/unit/views/fmExplorer.test.ts`.

3. Mock dependencies: ProfileStore, FMClient, SchemaSnapshotStore, SavedQueriesStore, JobRunner, EnvironmentSetStore.

4. Test tree structure:
   - `getChildren(undefined)` returns profile root nodes
   - `getChildren(profileNode)` returns layout group, saved queries group, snapshots group, etc.
   - `getChildren(layoutGroupNode)` returns layout items
   - Each tree item has correct `label`, `contextValue`, `collapsibleState`, and `iconPath`

5. Test refresh behavior: `refresh()` fires the `onDidChangeTreeData` event.

6. Run `npm test` — all tests must pass.

---

## Task 12: Add missing utility tests

**Status:** pending
**Phase:** 2H
**Depends on:** none
**Files to create:**
- `test/unit/errorUx.test.ts`
- `test/unit/hash.test.ts`
- `test/unit/jsonlWriter.test.ts`
- `test/unit/csp.test.ts`

**Instructions:**

1. Read each utility file:
   - `src/utils/errorUx.ts`
   - `src/utils/hash.ts`
   - `src/utils/jsonlWriter.ts`
   - `src/webviews/common/csp.ts`

2. Create tests for each:
   - `errorUx.test.ts`: test that `showCommandError` calls `vscode.window.showErrorMessage` with correct format, test the "Details" action opens a JSON document
   - `hash.test.ts`: test deterministic hashing of metadata objects, test empty input handling
   - `jsonlWriter.test.ts`: test writing multiple records to JSONL format, test special character escaping, test empty array
   - `csp.test.ts`: test `createNonce()` returns 32-char alphanumeric string, test `buildWebviewCsp()` includes correct directives, test nonce is embedded in policy string

3. Run `npm test` — all tests must pass.

---

## Task 13: Add Create Record and Delete Record types

**Status:** pending
**Phase:** 3A
**Depends on:** none
**Files to modify:**
- `src/types/fm.ts`
- `src/types/dataApi.ts`

**Instructions:**

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

3. Run `npm run lint` and `npm run typecheck` — must pass.

---

## Task 14: Add createRecord and deleteRecord to FMClient and ProxyClient

**Status:** pending
**Phase:** 3B/3C
**Depends on:** Task 13
**Files to modify:**
- `src/services/fmClient.ts`
- `src/services/proxyClient.ts`

**Instructions:**

1. Read `src/services/fmClient.ts` — study the `editRecord` method as the template.

2. Add `createRecord` to FMClient:
   - Signature: `async createRecord(profile: ConnectionProfile, layout: string, fieldData: Record<string, unknown>, control?: ClientRequestControl): Promise<CreateRecordResult>`
   - Validate fieldData is non-empty (throw FMClientError if empty)
   - POST to `layouts/${encodeURIComponent(layout)}/records` with body `{ fieldData }`
   - Use `requestWithAuth` for retry-on-401
   - Record history (operation: `'createRecord'`) and metrics
   - Return `{ recordId, modId, messages, response }` from envelope

3. Add `deleteRecord` to FMClient:
   - Signature: `async deleteRecord(profile: ConnectionProfile, layout: string, recordId: string, control?: ClientRequestControl): Promise<DeleteRecordResult>`
   - Validate recordId is non-empty string (throw FMClientError if empty)
   - DELETE to `layouts/${encodeURIComponent(layout)}/records/${encodeURIComponent(recordId)}`
   - Use `requestWithAuth` for retry-on-401
   - Record history (operation: `'deleteRecord'`) and metrics
   - Return `{ messages, response }` from envelope

4. Read `src/services/proxyClient.ts` — add proxy passthrough methods for both, following existing editRecord pattern.

5. Run `npm run lint` and `npm run typecheck` — must pass.

---

## Task 15: Integration tests for createRecord and deleteRecord

**Status:** pending
**Phase:** 3D
**Depends on:** Task 14
**Files to create:**
- `test/integration/createRecord.integration.test.ts`
- `test/integration/deleteRecord.integration.test.ts`

**Instructions:**

1. Follow the patterns in `test/integration/fmClient.integration.test.ts`.

2. `createRecord.integration.test.ts`:
   - Mock POST to `/fmi/data/vLatest/databases/{db}/sessions` for auth
   - Mock POST to `/fmi/data/vLatest/databases/{db}/layouts/{layout}/records` returning `{ response: { recordId: "42", modId: "1" }, messages: [{ code: "0", message: "OK" }] }`
   - Test success: assert result.recordId === "42"
   - Test validation: empty fieldData throws FMClientError
   - Test 401 retry: first call returns 401, re-auth, second call succeeds

3. `deleteRecord.integration.test.ts`:
   - Mock DELETE to `/fmi/data/vLatest/databases/{db}/layouts/{layout}/records/42` returning `{ response: {}, messages: [{ code: "0", message: "OK" }] }`
   - Test success: assert result.messages present
   - Test validation: empty recordId throws FMClientError
   - Test 404: mock 404 response, assert appropriate error

4. Run `npm test` — all tests must pass.

---

## Task 16: Register commands, wire RecordEditor create mode, explorer menus

**Status:** pending
**Phase:** 3E
**Depends on:** Task 14
**Files to modify:**
- `package.json`
- `src/commands/index.ts`
- `src/webviews/recordEditor/index.ts`
- `src/views/fmExplorer.ts`

**Instructions:**

1. In `package.json`:
   - Add commands: `filemakerDataApiTools.createRecord` ("FileMaker: Create Record"), `filemakerDataApiTools.deleteRecord` ("FileMaker: Delete Record")
   - Add both to `activationEvents`
   - Add context menu items under `contributes.menus.view/item/context`:
     - Create Record on layout nodes
     - Delete Record (if record-level context exists)

2. In `src/commands/index.ts`:
   - Register `createRecord`: pick profile -> pick layout -> open RecordEditor in create mode
   - Register `deleteRecord`: accept (layout, recordId) or prompt -> show warning confirmation -> call fmClient.deleteRecord -> show result
   - Apply role guard: viewer blocked from both
   - Apply workspace trust: delete blocked in untrusted workspaces

3. In `src/webviews/recordEditor/index.ts`:
   - Add `mode: 'edit' | 'create'` parameter to `createOrShow` (default `'edit'`)
   - In create mode: title = "Create Record — {layout}", empty field data, no recordId
   - On save in create mode: call `fmClient.createRecord` instead of `editRecord`
   - On success: show info message with recordId

4. In `src/views/fmExplorer.ts`: verify layout nodes have correct `contextValue` for menu binding.

5. Run `npm run lint`, `npm run typecheck`, `npm test` — all must pass.

---

## Task 17: Final CI pass and version bump

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
