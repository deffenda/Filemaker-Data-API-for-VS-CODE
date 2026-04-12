# Tasks

## Phase 1: Marketplace Launch + AI Query

### V1
Title: VS Code Marketplace publishing — icon, metadata, README, VSIX build
Status: pending
Phase: 1
Description: Prepare for Marketplace publication: create extension icon (simple, recognizable), set publisher to real org, write compelling Marketplace README with screenshots and feature highlights, configure VSIX build pipeline, add changelog. Ensure `vsce package` produces a clean VSIX. Test install from VSIX on a fresh VS Code instance. Categories: "Data Science", "Other". Keywords: "filemaker", "database", "data api", "claris".
Done when: `vsce package` builds clean VSIX. Marketplace README with screenshots. Icon set. Publisher configured. Ready to publish.

---

### V2
Title: First-run onboarding — guided connection setup
Status: pending
Phase: 1
Description: When the extension activates with no saved connections, show a walkthrough: step 1 — enter FileMaker Server host URL, step 2 — enter database name, step 3 — enter credentials (stored in VS Code Secret Storage), step 4 — test connection with clear pass/fail text. On success, auto-discover layouts and show the schema tree. Walkthrough uses VS Code's native walkthrough API. Skip button for experienced users.
Done when: First-run walkthrough guides connection setup. Credentials in Secret Storage. Test connection with pass/fail. Auto-discover layouts on success.

---

### V3
Title: AI Query Builder — natural language to FileMaker find requests
Status: pending
Phase: 1
Depends on: V2
Description: Add a "Query with AI" command (Cmd+Shift+Q) that accepts natural language and generates a FileMaker find request JSON. AI uses the current database schema (field names, types, relationships) as context. Shows the generated query for review before execution. "Find all customers in Texas with invoices over $5000 in the last 90 days" → generates the multi-request find JSON. Execute button runs the query and shows results in the record viewer. Requires user's own OpenAI API key (stored in VS Code Secret Storage). Works without AI key — just hides the command.
Done when: Cmd+Shift+Q opens natural language input. AI generates find request JSON from schema context. Preview before execution. Results shown in viewer. Graceful degradation without API key.

---

### V4
Title: Publish to VS Code Marketplace
Status: pending
Phase: 1
Depends on: V1, V2, V3
Description: Run `vsce publish` to publish the extension to the VS Code Marketplace. Verify listing appears with correct metadata, screenshots, and README. Test install from Marketplace on a fresh VS Code instance. Confirm extension activates, connection walkthrough appears, and AI query works. Create a GitHub release with the same version tag.
Done when: Extension live on VS Code Marketplace. Install from Marketplace works. All features functional. GitHub release created.

---

## Phase 2: Team Features

### V5
Title: Shared connection profiles via workspace settings
Status: pending
Phase: 2
Description: Expose non-secret connection fields (host, database, layout list) as workspace-scoped VS Code settings so they can be committed to a repo and shared with team members. Secret fields (username, password, token) remain in user-level Secret Storage. Team members clone the repo, install the extension, and see pre-configured connections — they only need to add their own credentials.
Done when: Connection profiles split into workspace settings (shareable) and Secret Storage (personal). Team members get pre-configured connections from repo.

---

### V6
Title: Team query library — shared saved queries
Status: pending
Phase: 2
Depends on: V3
Description: Add a shared saved-query store backed by a git-tracked JSON file (`.vscode/fmtools-queries.json`). Queries can be promoted from personal to shared. Shared queries visible to all team members. Query library as a sortable table: name, target layout, author, last used, use count. Execute from library with one click. Include AI-generated queries — save the natural language prompt alongside the generated find request.
Done when: Shared query file in workspace. Promote personal → shared. Library table with execute action. AI queries saved with prompt text.

---

### V7
Title: Audit log export — request history as CSV/JSONL
Status: pending
Phase: 2
Description: Add an export command that writes the request history store to CSV or JSONL, with optional date-range and layout filters. Each entry includes: timestamp, operation type, layout, record count, duration, user, status. Useful for compliance audit trails and debugging. Export from the request history view via "Export" button.
Done when: Export to CSV and JSONL. Date-range and layout filters. History entries include all metadata. Export button in history view.

---

## Phase 3: Intelligence + Community

### V8
Title: Schema Intelligence — AI-powered database analysis
Status: pending
Phase: 3
Depends on: V3
Description: AI analyzes the database schema and produces actionable insights: fields that are never populated across sampled records, tables with no relationships (orphans), field naming inconsistencies (camelCase mixed with snake_case), large text fields that should be containers, date fields stored as text. Show insights in a "Schema Health" panel. Each insight is actionable — click to navigate to the field/table. Runs on-demand, not automatically.
Done when: Schema Health panel shows AI insights. Each insight navigable. Analysis covers field usage, relationships, naming, types. On-demand execution.

---

### V9
Title: Data Explorer — AI-powered data pattern summary
Status: pending
Phase: 3
Depends on: V3
Description: AI summarizes data patterns for a selected table: record count, date range of created/modified timestamps, field population rates, value distribution for key fields, outlier detection. "This table has 142K records. 34% have empty email. Most common status: 'Active' (67%). 12 records have future dates in CreatedDate (possible data quality issue)." Shows as a compact text summary, not charts.
Done when: Data Explorer summarizes table patterns. Population rates, distributions, outliers detected. Text summary format. On-demand per table.

---

### V10
Title: Script Assistant — AI explains and optimizes FileMaker scripts
Status: pending
Phase: 3
Depends on: V3
Description: When viewing a FileMaker script (via Script Runner), add "Explain" action that produces a plain-language breakdown of what the script does step by step. "Suggest Improvements" action recommends optimizations: redundant steps, missing error handling, performance issues. AI uses the script steps + schema context. Output shown in a side panel. Editable suggestions (not auto-applied).
Done when: Explain action produces step-by-step breakdown. Suggest Improvements finds optimizations. Side panel display. Suggestions editable, not auto-applied.
