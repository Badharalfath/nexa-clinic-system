# Requirements

> Extract every in-scope functional, non-functional, user-flow, and observable
> design requirement from the source documents. Keep IDs stable after creation.

Status values: `Missing`, `Pending`, `In progress`, `Partial`, `Complete`,
`Blocked`, `Out of scope`.

| ID | Requirement | Source | Acceptance criteria | Priority | Status |
|---|---|---|---|---|---|
| PLAN-REQ-001 | Complete source-to-requirement audit | Product/PRD/DESIGN | Every source item is represented or explicitly excluded with a reason | P0 | In progress |
| DELIV-ERD-001 | Provide an ERD for the implemented PostgreSQL schema | PRD §8, deliverable 4 | Diagram includes the eight persisted tables, PK/UK/FK fields, all FK relationships, and database-accurate cardinalities | P0 | Complete |

## Contradictions and missing acceptance criteria

- PRD version 1.1 is aligned to the PDF, but AS-001 through AS-009 remain open.
- No `DESIGN.md` source was found.
- The complete implementation-status inventory has not yet been added here.
