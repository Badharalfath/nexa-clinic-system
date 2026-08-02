# Requirement Traceability and Test Matrix

Status values: `Missing`, `Planned`, `In progress`, `Passing`, `Failing`,
`Blocked`, `Out of scope`.

| Requirement ID | Implementation evidence | Automated test / command | UI route + viewport / manual evidence | Status |
|---|---|---|---|---|
| PLAN-REQ-001 | PRD 1.1 source coverage matrix; full implementation inventory pending | PDF-to-PRD section and list comparison | N/A | In progress |
| DELIV-ERD-001 | `docs/erd.mmd`, `docs/erd-mapping.html`, and Chen-style `docs/erd-diagram.html`; fields and relationships traced to `backend/database/schema.sql` | Schema-to-ERD structural comparison: 8 tables, 9 FK relationships, and two FK+UNIQUE optional one-to-one relationships | Reviewed rendered `docs/erd-mermaid.png`, `docs/erd-mapping.png`, and `docs/erd-diagram.png` (1760 × 1600) | Passing |

## Latest full verification

- Not run.

## Known evidence gaps

- PDF-to-PRD source coverage is complete.
- The implementation inventory and open-assumption decisions are not complete.
