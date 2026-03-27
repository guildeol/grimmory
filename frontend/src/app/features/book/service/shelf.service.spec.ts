import {describe, it} from 'vitest';

// NOTE(frontend-seam): Real coverage here needs a test seam around Angular Query's
// `injectQuery()` lifecycle, auth-token reactivity, and computed/effect hydration so
// HTTP/cache behavior can be asserted without coupling the spec to live query runtime wiring.
describe.skip('ShelfService', () => {
  it('needs a query-runtime seam to verify shelf cache invalidation and auth-driven enablement', () => {
    // TODO(seam): Cover invalidateQueries/removeQueries behavior after wrapping injectQuery/queryClient wiring.
  });

  it('needs a stable data-source seam to verify owner-aware shelf book counts without booting the full query graph', () => {
    // TODO(seam): Cover getBookCountValue and unshelved calculations once query state can be injected directly.
  });
});
