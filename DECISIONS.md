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

### D-002 — The assignment PDF is the normative product source

- Status: accepted
- Date: 2026-08-01
- Context: The original PRD mixed PDF requirements with implementation choices,
  assumptions, and unverified completion claims.
- Decision: Keep mandatory scope faithful to the PDF. Label implementation
  choices separately and record unspecified business rules as open assumptions.
- Consequences: Implementation status belongs in `REQUIREMENTS.md` and
  `TEST_MATRIX.md`; accepted assumptions must be documented in the final README.
