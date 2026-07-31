# AGENTS.md

Project-specific instructions for coding agents.

<!-- hermes-project-continuity:start -->
## Hermes project delivery protocol

Treat models and chat summaries as replaceable. Repository files and fresh
verification evidence are authoritative.

### Required behavior

1. For requests to build, implement, continue, finish, or audit this product,
   load and follow the `project-delivery-loop` skill.
2. Read `PROJECT_STATE.md`, `TASKS.md`, and `DECISIONS.md` before editing. Read
   the linked PRD/product, `DESIGN.md`, `REQUIREMENTS.md`,
   `IMPLEMENTATION_PLAN.md`, and `TEST_MATRIX.md` before planning a task.
3. Work on one small unblocked task at a time. Use sequential implementer,
   specification-review, and quality-review stages; never parallelize writes to
   the same checkout.
4. Do not mark a task complete until its acceptance criteria, relevant tests,
   and UI visual checks pass with recorded evidence.
5. Do not declare the project complete while any in-scope requirement is
   Pending, Missing, Partial, Unknown, or Blocked, or while required test,
   type-check, lint, build, E2E, or visual evidence is absent.
6. Update the control files after every completed task and record one exact
   next action before ending a turn.
7. After three failures at the same gate without new evidence, record the
   blocker and ask for input instead of looping indefinitely.

Priority on conflict: explicit user instruction, `DECISIONS.md`,
`REQUIREMENTS.md`, PRD/product, `DESIGN.md`, existing implementation. Do not
silently reduce scope or substitute placeholders, fake data, TODOs, empty
handlers, or simplified UI for required behavior.
<!-- hermes-project-continuity:end -->
