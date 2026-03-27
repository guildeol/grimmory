import {describe, it} from 'vitest';

// NOTE(frontend-seam): Real coverage here needs seams around the eager injectQuery-backed cache,
// auth-token-driven effects, router navigation, and websocket/query invalidation fanout so the
// service can be tested without booting a full Angular Query runtime and synthetic auth lifecycle.
describe.skip('BookService', () => {
  it('needs an injectable query-runtime seam to verify computed book caches and token-driven refresh behavior', () => {
    // TODO(seam): Cover books/uniqueMetadata/booksError state once injectQuery and auth-token effects are wrapped behind a thin adapter.
  });

  it('needs a navigation-and-reader seam to verify readBook routing, query params, and last-read updates deterministically', () => {
    // TODO(seam): Cover format-specific routing, unsupported-book handling, and websocket delegation after router/query side effects are injectable.
  });
});
