import {describe, it} from 'vitest';

// NOTE(frontend-seam): Real coverage here needs a seam around Angular Query cache orchestration,
// auth-token enablement, and signal-backed loading state so the service can be exercised without
// reproducing the full runtime query graph in every spec.
describe.skip('LibraryService', () => {
  it('needs a query-runtime seam to verify library cache invalidation and format-count hydration', () => {
    // TODO(seam): Cover create/update/delete/refresh flows after injectQuery and ensureQueryData are wrapped for tests.
  });

  it('needs an injectable sorting/loading seam to verify library ordering and large-library state transitions deterministically', () => {
    // TODO(seam): Cover sorted query results and largeLibraryLoading updates once runtime query wiring is abstracted.
  });
});
