# Plan

## Goal

FileMaker Data API for VS Code becomes THE FileMaker developer extension — the tool every FileMaker developer installs first, the reason teams adopt VS Code for FileMaker work, and the bridge that brings FileMaker into the modern developer ecosystem.

## North Star

Within 12 months, this extension is the most-downloaded FileMaker tool on the VS Code Marketplace, with active community contributors and recognition as the standard way professional teams interact with FileMaker databases outside of FileMaker Pro.

## Why This Wins

- **Free and open source** — Claris charges for FileMaker Pro seats. This gives developers a free path to data access, schema management, and query building.
- **VS Code native** — developers already live in VS Code. Meeting them where they work beats any standalone tool.
- **AI-enhanced** — no FileMaker tool has AI-assisted query building, schema analysis, or data exploration. This is a category gap.
- **Team-first** — shared connection profiles, team query libraries, and audit logs turn it from a solo tool into a team platform.

## AI Integration Strategy

- **AI Query Builder** — describe what you want in natural language ("show me all invoices over $10K from last quarter with customer name"), AI generates the FileMaker query (find request JSON). No learning the find request syntax.
- **Schema Intelligence** — AI analyzes the database schema and suggests: missing indexes, relationship optimization, field naming inconsistencies, unused fields. "Your Invoices table has 47 fields but 12 are never populated."
- **Data Explorer** — AI summarizes data patterns: "This table has 142K records. 34% have empty email fields. Created dates span 2019-2024. Most active layout: InvoiceList."
- **Script Assistant** — AI explains FileMaker scripts in plain language, suggests optimizations, identifies potential errors.

## Phases

### Phase 1: Marketplace Launch + AI Query (V1-V4)
Publish to VS Code Marketplace, add AI query builder, polish onboarding.

### Phase 2: Team Features (V5-V7)
Shared profiles, team query library, audit export, collaboration workflow.

### Phase 3: Intelligence + Community (V8-V10)
Schema intelligence, data explorer, script assistant, community templates.

## Constraints

- Extension must work without AI (AI is additive, not required)
- No telemetry, no account required for core features
- FileMaker Data API is the only integration point (no ODBC, no direct file access)
- One task at a time, one PR per task (or batched related tasks)
