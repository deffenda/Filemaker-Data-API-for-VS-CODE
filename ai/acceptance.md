# Acceptance Criteria — v0.6.0

---

## Webview Stability (Phase 1)

### AC-1: Loading skeletons prevent empty-form flash

- [ ] All 5 primary webviews (queryBuilder, recordEditor, recordViewer, scriptRunner, schemaDiff) show an animated skeleton placeholder on initial render
- [ ] Skeleton is hidden and content is shown when the first data message arrives via postMessage
- [ ] No visible empty dropdowns or blank forms before data loads

### AC-2: recordEditor does not flicker on field changes

- [ ] Field table is built once on initial load; subsequent data updates modify textarea values in place without rebuilding the table
- [ ] `fieldEditor.innerHTML = ''` is no longer called after initial render
- [ ] Typing in a field textarea does not cause the table to rebuild
- [ ] `markDirtyState()` is debounced by at least 150ms
- [ ] Discard button updates field values in place without rebuilding the table

### AC-3: queryBuilder does not flicker on profile/layout changes

- [ ] Profile and layout `<select>` elements are updated incrementally (add/remove options) not cleared and rebuilt
- [ ] Selected value is preserved when options are updated (if still valid)
- [ ] Virtualized table scroll handler uses `requestAnimationFrame` (no synchronous read-write layout thrashing)
- [ ] Virtualization threshold is 50 rows (not 250)

### AC-4: Remaining webviews use targeted updates

- [ ] recordViewer updates field cells in place on subsequent record loads (not full container clear)
- [ ] scriptRunner updates profile select incrementally
- [ ] schemaDiff sections fade in with CSS transition (not instant pop)

### AC-5: Responsive CSS works across viewport sizes

- [ ] All webview containers use `max-width: min(Xpx, 95vw)` (fluid, not fixed)
- [ ] Body text uses `clamp()` for font sizing
- [ ] No table has a fixed `min-width` causing forced horizontal scroll
- [ ] Tables wider than viewport are inside a scrollable wrapper
- [ ] Status message containers have `aria-live="polite"` attribute

---

## Test Coverage (Phase 2)

### AC-6: Coverage reporting is configured and runs in CI

- [ ] `@vitest/coverage-v8` is in devDependencies
- [ ] `npm run test:coverage` generates an lcov report in `./coverage/`
- [ ] CI workflow runs `test:coverage` instead of plain `test`
- [ ] `coverage/` directory is in `.gitignore`

### AC-7: ProxyClient has unit tests

- [ ] `test/unit/proxyClient.test.ts` exists
- [ ] Tests cover all 7 public methods: createSession, deleteSession, listLayouts, getRecord, findRecords, editRecord, runScript
- [ ] Tests verify correct HTTP method, path, and response mapping
- [ ] All tests pass

### AC-8: Command handlers have unit tests

- [ ] `test/unit/commands/core.test.ts` tests profile CRUD and connect/disconnect commands
- [ ] `test/unit/commands/data.test.ts` tests find, getById, and webview-opening commands
- [ ] `test/unit/commands/features.test.ts` tests batch, saved queries, snapshots, type generation, and role guard enforcement
- [ ] All tests mock VS Code window APIs and verify correct service calls
- [ ] All tests pass

### AC-9: Webview HTML output has snapshot tests

- [ ] `test/unit/webviews/htmlSnapshots.test.ts` exists
- [ ] Snapshot baseline exists for each webview (queryBuilder, recordEditor, recordViewer, scriptRunner, schemaDiff, environmentCompare)
- [ ] Tests verify CSP nonce is present, required DOM element IDs exist, no inline event handlers
- [ ] All tests pass

### AC-10: fmExplorer tree view has tests

- [ ] `test/unit/views/fmExplorer.test.ts` exists
- [ ] Tests cover getChildren for root, profile, and layout levels
- [ ] Tests verify correct label, contextValue, and collapsibleState for each node type
- [ ] All tests pass

### AC-11: Missing utility functions have tests

- [ ] `test/unit/errorUx.test.ts` exists and covers showCommandError
- [ ] `test/unit/hash.test.ts` exists and covers deterministic hashing
- [ ] `test/unit/jsonlWriter.test.ts` exists and covers multi-record output and edge cases
- [ ] `test/unit/csp.test.ts` exists and covers createNonce and buildWebviewCsp
- [ ] All tests pass

---

## Complete CRUD (Phase 3)

### AC-12: CreateRecordResult and DeleteRecordResult types exist

- [ ] `src/types/fm.ts` exports `CreateRecordResult` with fields: recordId, modId?, messages, response
- [ ] `src/types/fm.ts` exports `DeleteRecordResult` with fields: messages, response
- [ ] `src/types/dataApi.ts` exports `DataApiCreateRecordResponse` and `DataApiDeleteRecordResponse`
- [ ] `npm run typecheck` passes

### AC-13: FMClient.createRecord works

- [ ] Public method `createRecord(profile, layout, fieldData, control?)` exists
- [ ] POSTs to `layouts/{layout}/records` with `{ fieldData }` body
- [ ] Uses `requestWithAuth` for 401 retry
- [ ] Throws FMClientError on empty fieldData
- [ ] Records history and metrics

### AC-14: FMClient.deleteRecord works

- [ ] Public method `deleteRecord(profile, layout, recordId, control?)` exists
- [ ] DELETEs `layouts/{layout}/records/{recordId}`
- [ ] Uses `requestWithAuth` for 401 retry
- [ ] Throws FMClientError on empty recordId
- [ ] Records history and metrics

### AC-15: ProxyClient supports create and delete

- [ ] ProxyClient has createRecord and deleteRecord methods
- [ ] Both follow existing proxy passthrough patterns

### AC-16: Integration tests pass for create and delete

- [ ] `test/integration/createRecord.integration.test.ts` tests success, validation error, and 401 retry
- [ ] `test/integration/deleteRecord.integration.test.ts` tests success, validation error, and 404
- [ ] `npm test` passes with all new tests green

### AC-17: Commands are registered and functional

- [ ] `package.json` declares `filemakerDataApiTools.createRecord` and `filemakerDataApiTools.deleteRecord`
- [ ] Both appear in `activationEvents`
- [ ] createRecord opens RecordEditor in create mode
- [ ] deleteRecord shows confirmation dialog before executing
- [ ] Viewer role blocked from both (role guard)
- [ ] Delete blocked in untrusted workspaces

### AC-18: RecordEditor supports create mode

- [ ] `createOrShow` accepts `mode: 'edit' | 'create'` parameter (default: 'edit')
- [ ] Create mode: title is "Create Record — {layout}", fields initially empty
- [ ] Create mode save: calls fmClient.createRecord
- [ ] On success: shows info message with new recordId
- [ ] Edit mode: works unchanged (backward compatible)

### AC-19: Explorer context menus exist

- [ ] "Create Record" appears in context menu on layout tree items
- [ ] Menu items bind to correct commands

---

## Final Validation (Phase 4)

### AC-20: CI pipeline passes clean

- [ ] `npm run lint` — zero warnings
- [ ] `npm run typecheck` — zero errors
- [ ] `npm test` — all tests pass
- [ ] `npm run build` — compiles successfully
- [ ] Coverage report is generated

### AC-21: Version and changelog updated

- [ ] `package.json` version is `"0.6.0"`
- [ ] `CHANGELOG.md` has `## 0.6.0` section with all changes listed
