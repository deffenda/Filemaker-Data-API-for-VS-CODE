# Roadmap — FileMaker Data API Tools for VS Code

Open-source, free connector for FileMaker Data API (fmrest) workflows.

---

## Shipped

### v0.1.0 — MVP
- Connection profiles with secure secret handling
- FileMaker Explorer tree view
- Query Builder and Record Viewer webviews
- Data API client with token lifecycle and 401 retry
- Direct and proxy auth modes

### v0.2.0 — Query & Script
- Saved Queries v2 (workspace/global scope, schema versioning, import/export)
- Schema/field metadata browser
- Script Runner webview
- Query Builder upgrades (history, export, copy as curl/fetch)
- Request history store

### v0.3.0 — Schema & Batch
- Schema snapshots and diff workflows
- TypeScript type generation from layout metadata
- Record Editor with write-back support
- Batch export (JSONL/CSV) and batch update with dry-run
- Job runner with progress tracking
- CI workflow

### v0.4.0 — Enterprise
- Environment sets and cross-environment comparison
- Role-based feature controls (viewer/developer/admin)
- Diagnostics dashboard and request metrics
- Adaptive concurrency and circuit breaker
- Plugin architecture
- Offline metadata mode

### v0.5.0 — Hardening
- Centralized settings service
- Shared error and redaction infrastructure
- Webview CSP and message validation hardening
- Profile input validation and output path sanitization
- Documentation overhaul

### v0.5.1 — Patch
- Layout folder parsing fix
- VSIX packaging fix

---

## In Progress

### v0.6.0 — Stability, Coverage, Complete CRUD

**Theme:** Make this connector reliable and performant for real-world use.

**Phase 1: Webview rendering stability**
- Loading skeletons on all webviews (done)
- Targeted DOM updates replacing innerHTML clears (recordEditor, queryBuilder, recordViewer, scriptRunner, schemaDiff)
- Input debouncing and scroll handler optimization
- Responsive CSS (fluid widths, clamp fonts, ARIA attributes)

**Phase 2: Test coverage**
- Coverage reporting with @vitest/coverage-v8
- ProxyClient unit tests (7 methods, currently 0%)
- Command handler tests (core, data, feature commands — currently 0%)
- Webview HTML snapshot tests
- fmExplorer tree view tests
- Missing utility tests (errorUx, hash, jsonlWriter, csp)

**Phase 3: Complete CRUD**
- Create Record (types, FMClient, ProxyClient, command, RecordEditor create mode)
- Delete Record (types, FMClient, ProxyClient, command, confirmation dialog)
- Integration tests for both operations
- Explorer context menus

---

### v0.7.0 — Value Lists & Container Fields (shipped)

**Theme:** Support the two most-requested FileMaker Data API features that are missing.

- Value list retrieval from layout metadata
- Value list dropdown integration in Record Editor and Query Builder
- Container field data download (binary GET from container URL)
- Container field display in Record Viewer (image preview, file download link)
- Container field upload support in Record Editor
- Tests for value list and container field operations

### v0.8.0 — Portal & Related Records (shipped)

**Theme:** First-class portal support for relational FileMaker workflows.

- Portal data rendering in Record Viewer (tabbed portal sections instead of raw JSON)
- Portal record editing in Record Editor
- Portal-aware find requests in Query Builder (portal filter parameters)
- Create related record through portal
- Portal pagination support
- Type generation for portal fields

### v0.9.0 — Global Fields & Multi-Request (shipped)

**Theme:** Advanced Data API features for power users.

- Set global field values (pre-request globals)
- Compound find requests (multiple request objects with omit support)
- Visual query builder for compound finds (add/remove request rows, omit toggle)
- Request templates (save and reuse compound find patterns)
- Duplicate record support

### v1.0.0 — Production Release (shipped)

**Theme:** Marketplace-ready quality bar for public release.

- VS Code Marketplace publishing
- End-to-end test suite (VS Code Extension Test framework with @vscode/test-electron)
- Performance benchmarks for batch operations
- Accessibility audit and WCAG compliance for all webviews
- Localization infrastructure (i18n for UI strings)
- Getting Started walkthrough (VS Code walkthrough contribution)
- Extension icon and marketplace assets
- Stable API for plugin authors
- Security audit (dependency review, secret handling verification)

---

## Future (Post 1.0)

### Collaboration Features
- Shared connection profiles via workspace settings (non-secret fields)
- Team query library (shared saved queries via git-tracked file)
- Audit log export for compliance workflows

### Real-Time & Sync
- FileMaker Data API webhook listener (if/when supported)
- Record change polling with configurable interval
- Diff viewer for record changes over time

### Advanced IDE Integration
- IntelliSense for field names in JSON find queries
- Go-to-definition from generated types to layout metadata
- FileMaker calculation syntax highlighting
- Notebook support (Jupyter-style cells for Data API exploration)

### Platform Expansion
- FileMaker Cloud support (Claris ID authentication)
- FileMaker Server admin API integration (schedules, logs, backups)
- OData connector for FileMaker OData API

---

## How This Roadmap Drives Automation

The overnight pipeline reads this file when all tasks in a batch are `done`. Claude uses it to plan the next version's work automatically:

1. v0.6.0 tasks complete → Claude reads this roadmap → plans v0.7.0 tasks
2. v0.7.0 tasks complete → Claude reads this roadmap → plans v0.8.0 tasks
3. And so on through v1.0.0

Each version maps to one planning batch. Claude produces `ai/plan.md`, `ai/tasks.md`, and `ai/acceptance.md` for the next version, sets `ready_for_codex`, and the pipeline continues.
