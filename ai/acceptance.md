# Acceptance Criteria — v0.7.0

## AC-1: Value list types and extraction
- [ ] `ValueListItem` interface exists in fm.ts with `value` and `displayValue` fields
- [ ] `ValueList` interface exists with `name` and `values: ValueListItem[]`
- [ ] `extractValueLists()` utility extracts value lists from layout metadata
- [ ] Unit tests pass for extraction with valid data, empty data, missing field

## AC-2: Value lists in explorer
- [ ] Layout nodes in fmExplorer show a "Value Lists" group when value lists exist
- [ ] Each value list appears as a child node with its name

## AC-3: Value lists in Record Editor
- [ ] Fields with associated value lists render as `<select>` dropdowns
- [ ] Fields without value lists still render as `<textarea>`
- [ ] Selected value list option sets the field value correctly

## AC-4: Container field detection
- [ ] `isContainerField()` correctly identifies container type fields
- [ ] `resolveContainerUrl()` builds full download URL from server URL and container value
- [ ] Unit tests pass for both utilities

## AC-5: Container display in Record Viewer
- [ ] Container fields with image content types show inline image preview
- [ ] Container fields with non-image types show a download link
- [ ] Non-container fields display unchanged

## AC-6: Container handling in Record Editor
- [ ] Container fields are read-only in the editor
- [ ] Container fields show informational text about upload limitations

## AC-7: CI passes clean
- [ ] `npm run lint` — zero warnings
- [ ] `npm run typecheck` — zero errors
- [ ] `npm test` — all tests pass
- [ ] Version is 0.7.0
- [ ] CHANGELOG.md has v0.7.0 section
