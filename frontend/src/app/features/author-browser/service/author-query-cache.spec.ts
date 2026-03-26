import {describe, expect, it} from 'vitest';
import {QueryClient} from '@tanstack/angular-query-experimental';

import {patchAuthorInCache} from './author-query-cache';
import {AUTHORS_QUERY_KEY} from './author-query-keys';

describe('patchAuthorInCache', () => {
  it('updates the matching author in cache', () => {
    const queryClient = new QueryClient();

    queryClient.setQueryData(AUTHORS_QUERY_KEY, [
      {id: 1, name: 'Le Guin', bookCount: 4, hasPhoto: true},
      {id: 2, name: 'Butler', bookCount: 2, hasPhoto: false},
    ]);

    patchAuthorInCache(queryClient, 2, {hasPhoto: true, name: 'Octavia Butler'});

    expect(queryClient.getQueryData(AUTHORS_QUERY_KEY)).toEqual([
      {id: 1, name: 'Le Guin', bookCount: 4, hasPhoto: true},
      {id: 2, name: 'Octavia Butler', bookCount: 2, hasPhoto: true},
    ]);
  });

  it('leaves an empty cache untouched', () => {
    const queryClient = new QueryClient();

    patchAuthorInCache(queryClient, 9, {name: 'Nobody'});

    expect(queryClient.getQueryData(AUTHORS_QUERY_KEY)).toEqual([]);
  });
});
