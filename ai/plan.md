# Plan — v0.7.0: Value Lists & Container Fields

## Overview

Add value list support and container field handling to the extension. Value lists are a core FileMaker concept — dropdown/radio/checkbox choices tied to fields. Container fields hold binary data (images, PDFs, files). Both are already returned by the Data API metadata endpoint but not yet surfaced in the UI.

## Phase 1: Value List Support

### 1A: Types and extraction

Add `ValueListItem` type. Add utility to extract value lists from layout metadata response. The FileMaker Data API returns value lists under `response.valueLists` as an array of `{ name, values: [{ value, displayValue }] }`.

### 1B: Value list display in schema/explorer

Show value lists under layout nodes in the explorer tree. Display value list items in the metadata viewer.

### 1C: Value list dropdowns in Record Editor

When a field has an associated value list, render a `<select>` dropdown instead of a plain `<textarea>` in the Record Editor. Fall back to textarea if no value list is associated.

### 1D: Value list integration in Query Builder

Add value list dropdown for field values in the Query Builder find criteria section when the selected layout has value lists.

## Phase 2: Container Fields

### 2A: Container field detection and URL resolution

Container fields in the Data API return a URL string pointing to the binary content. Add a utility to detect container field types from metadata and resolve the full download URL.

### 2B: Container field display in Record Viewer

When a field is a container type, display it as an image preview (for image types) or a download link (for other types) instead of showing the raw URL string.

### 2C: Container field handling in Record Editor

In create/edit mode, container fields should show as read-only with a note that container uploads require the Data API container upload endpoint. Mark them as non-editable in the field editor.

## Phase 3: Tests and Validation

### 3A: Tests for value lists and container fields

Unit tests for value list extraction, container URL resolution. Integration tests for metadata with value lists. Snapshot updates for webview HTML.

### 3B: Final CI pass and version bump

Run full validation, bump to 0.7.0, update changelog.
