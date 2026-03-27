import {describe, it} from 'vitest';

// NOTE(frontend-seam): Real coverage here needs a stable Angular Query plus signals/effects test harness
// so the spec can assert token-gated queries, query invalidation, and public-settings cache sync without runtime changes.
describe.skip('AppSettingsService', () => {
  it('needs a query-client seam to validate query options, cache sync, and effect-driven invalidation', () => {
    // Intentionally skipped until the app exposes a stable Angular Query test seam.
  });
  it('needs a controlled auth-token signal seam to validate token-gated query enablement without mutating runtime code', () => {
    // Intentionally skipped until token gating can be driven without changing runtime code.
  });
});
