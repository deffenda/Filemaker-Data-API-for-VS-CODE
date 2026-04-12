# Tasks — v0.7.0

---

## Task 1: Value list types, extraction, explorer, and Record Editor integration

**Status:** ready_for_codex
**Phase:** 1A-1C
**Depends on:** none

**Instructions:**

1. Add `ValueListItem` and `ValueList` interfaces to `src/types/fm.ts`
2. Add `extractValueLists(metadata)` utility to `src/utils/valueListParser.ts`
3. Add value list nodes under layout in fmExplorer tree
4. In Record Editor: when field metadata includes a value list, render `<select>` instead of `<textarea>`
5. Add unit tests for value list extraction
6. Run lint, typecheck, test

---

## Task 2: Container field display and handling

**Status:** pending
**Phase:** 2A-2C
**Depends on:** none

**Instructions:**

1. Add `isContainerField(field)` utility to `src/utils/containerFieldUtils.ts`
2. Add `resolveContainerUrl(serverUrl, containerValue)` utility
3. In Record Viewer: display container fields as image preview or download link
4. In Record Editor: mark container fields as read-only with informational note
5. Add unit tests for container field detection and URL resolution
6. Run lint, typecheck, test

---

## Task 3: Final CI pass and version bump to 0.7.0

**Status:** pending
**Phase:** 3B
**Depends on:** Task 1, Task 2

**Instructions:**

1. Run full validation: lint, typecheck, test
2. Bump version to 0.7.0
3. Update CHANGELOG.md
4. Run lint, typecheck, test, verify clean
