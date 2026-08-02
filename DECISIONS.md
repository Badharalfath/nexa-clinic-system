# Decisions

Record only durable decisions future models must preserve.

## Decision log

### D-001 — Project files are the durable handoff

- Status: accepted
- Date: 2026-07-31
- Context: The upstream model may change during a Hermes session.
- Decision: Use project specifications, control files, repository evidence, and
  fresh verification results instead of conversational memory.
- Consequences: Every completed task updates the handoff and evidence matrix.

### D-002 assignment PDF normative product source

- Status: accepted
- Date: 2026-08-01
- Context: original PRD mixed PDF requirements implementation choices,
  assumptions, unverified completion claims.
- Decision: Keep mandatory scope faithful PDF. Label implementation
  choices separately record unspecified business rules open assumptions.
- Consequences: Implementation status belongs `REQUIREMENTS.md` and
  `TEST_MATRIX.md` accepted assumptions must documented final README.

### D-003 Google Stitch design system frontend

- Status: accepted
- Date: 2026-08-02
- Context: user generated design system 5 screen designs Google Stitch
  stored `stitch_prd_design_implementation/` asked project continue.
- Decision: Adopt Stitch "NEXA CIS" design system Corporate Modern
  Clinical Blue primary `#005EB8` navy sidebar `#002F6C` Inter
  Courier Prime mono identifiers radii 4px/8px status tokens
  slate/sky/amber/emerald. Keep inline SVG icon component (user
  preference: no emoji, no external icon font).
- Consequences: Frontend theme "Klinik Sehat" replaced NEXA CIS.
  Backend unchanged. Design source`DESIGN.md` frontend must follow.

### D-004 — SQL schema is authoritative for the ERD

- Status: accepted
- Date: 2026-08-03
- Context: ERD cardinality must reflect database-enforced constraints, not only
  the intended clinical workflow.
- Decision: Derive `docs/erd.mmd` and `docs/erd-mapping.html` from
  `backend/database/schema.sql`; show `registrations` → `queues` and
  `registrations` → `medical_records` as `0..1` on the child side because
  their foreign keys are unique but no constraint requires a child row.
- Consequences: The ERD remains correct for registrations that have not yet
  progressed to queueing or examination.
