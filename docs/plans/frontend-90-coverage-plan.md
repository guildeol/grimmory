# Frontend 90% Coverage Execution Plan

## Summary

Drive the frontend to an honest `>=90%` on statements, branches, functions, and lines for application code, and keep going until both the global total and each major frontend area clear the bar. Use this branch/workspace directly. Progress is measured with the repo command surface, especially `just ui typecheck`, `just ui lint`, `just ui test`, `just ui coverage`, and periodic `just ui check`.

This file is the persistent source of truth for the run. Every later summary, checkpoint, or resume-after-compaction step should explicitly re-anchor to `docs/plans/frontend-90-coverage-plan.md`.

Operating rules:

- Default: do not change runtime code to make tests possible.
- Exception policy: if a file is truly blocked, make the smallest runtime seam change only in its own conventional commit with an explicit defense, so it can be reviewed or reverted independently.
- Commit frequently with conventional commits after each stable coverage gain batch; do not wait for one giant final commit.

## Harness And Configuration

- Consolidate the frontend onto one canonical Vitest config used by Angular's unit-test builder. Remove the current drift between `vitest-base.config.ts` and the richer unused config.
- Enforce coverage thresholds in that canonical config for all four metrics at `90`, with machine-readable output enabled for automated progress tracking.
- Keep template coverage enabled and keep `src/main.ts` in scope. Do not broaden exclusions to hit the number.
- Install and integrate:
  - `@testing-library/angular`
  - `@testing-library/user-event`
  - `@testing-library/jest-dom`
  - `msw`
  - `@playwright/test`
  - `vitest-canvas-mock`
- Expand `src/test-setup.ts` with stable browser shims needed by the app and readers: observers, scroll APIs, pointer/canvas helpers, object URLs, and other browser primitives that are safe test-harness additions.
- Add shared test-only helpers for router rendering, Transloco, QueryClient setup, factory builders, and MSW handler bundles by domain.
- Add a coverage-summary script or command that reads the generated coverage JSON and reports:
  - global metrics
  - per-family metrics for `core`, `shared`, and each `features/*` bucket
  - the worst uncovered files by branch deficit

## Execution Loop

- Start with a clean baseline:
  - `just ui typecheck`
  - `just ui lint`
  - `just ui test`
  - `just ui coverage`
- Parse the coverage JSON after each full run and rank work by branch deficit first, then statements/functions/lines.
- Work bucket by bucket in this order:
  1. Bootstrap, routing, auth, setup, login
  2. Shared services and shared components/layout
  3. Book, bookdrop, library creation
  4. Metadata, settings, stats
  5. Readers
  6. Remaining helpers, dialogs, and route-entry shells
- For each bucket:
  - add tests
  - run targeted tests for that bucket
  - run `just ui typecheck`
  - run `just ui lint`
  - run `just ui coverage`
  - update this plan with a brief progress checkpoint if the bucket order or blocker status changes
  - commit once the bucket is green and coverage materially improved
- Every few buckets, run `just ui check` to catch cross-surface regressions early.
- Do not stop when global coverage first crosses `90` if any major area remains materially behind; continue until the lagging areas also clear `90`.

## Test Generation Scope

### Bootstrap/Auth/Routing

- Cover `main.ts` provider wiring, app initializers, QueryClient defaults, Transloco bootstrap, service worker enablement, and router bootstrap.
- Cover `app.routes.ts` route definitions, guards, lazy route entrypoints, and fallback redirects.
- Cover auth/setup/login guards and auth initializer.
- Cover `AuthInterceptorService` including token attach, non-API bypass, 401 refresh success, refresh failure, and concurrent refresh waiting.
- Cover the login component thoroughly: local login paths, default-password redirect, rate-limit/network/unexpected failures, OIDC redirect limits, query-param error mapping, and provider-init failures.

### Shared/Core

- Raise coverage across app config/settings/auth/version/startup/local storage/websocket/dialog-launcher/icon/font helpers.
- Add render/integration tests for shared shell pieces and interactive shared components, focusing on permissions, empty states, toggles, and error branches.

### Feature Families

- `book`: services, query/cache/socket helpers, browser filters/sorting/view toggles, bulk actions, dialogs, and series flows.
- `bookdrop`: review/finalize/pattern extraction/state transitions and event-driven behavior.
- `library-creator`: validation, progress, cancellation, and failure states.
- `metadata`: picker/searcher/viewer/editor, task/review flows, sidecar interactions, fetch option dialogs, and bulk update branches.
- `settings`: user management, content restrictions, fonts, email, metadata settings, reader preferences, task management, and profile flows.
- `stats`: data-transform services and route-entry components with deterministic chart inputs; verify behavior and outputs rather than brittle chart internals.

### Readers

- Cover `ebook-reader` and `cbx-reader` logic-heavy services/state first, then component/control behavior, then dialogs/layout shells.
- Add Playwright smoke/regression tests for login, guarded navigation, book browser, metadata center, one stats page, ebook reader, and cbx reader.
- Use Playwright to prove browser-real flows, but keep Vitest as the source of coverage truth.

## Commit And Acceptance Rules

- Commit cadence:
  - one setup commit for harness/tooling plus plan doc creation
  - then one conventional commit per stable coverage batch or feature bucket
  - runtime seam exceptions, if any, get their own isolated conventional commit with explicit justification
- Preferred commit pattern:
  - `docs(plan): add frontend 90 coverage execution plan` for the initial plan artifact
  - `chore(testing): ...` for harness/config changes
  - `test(frontend): ...` for test additions
  - `test(auth): ...`, `test(readers): ...`, `test(metadata): ...` for focused batches
  - `fix(testing): ...` only for genuinely broken harness behavior
- Final acceptance requires:
  - `just ui typecheck` passing
  - `just ui lint` passing
  - `just ui test` passing
  - `just ui coverage` proving `>=90` on statements, branches, functions, and lines
  - periodic `just ui check` green at the end
  - Playwright smoke suite passing for the browser-critical flows above
  - the final status summary explicitly references `docs/plans/frontend-90-coverage-plan.md`

## Assumptions And Defaults

- The `90%` target means all four metrics, not statements only.
- Coverage scope includes frontend application code and templates plus `src/main.ts`; no broad exclusions are allowed.
- Runtime code changes are disallowed by default; if unavoidable, they must be isolated in a separately defended commit.
- This branch is the execution surface; no separate worktree is needed.
- Frequent conventional commits are part of the execution plan, not deferred cleanup.
