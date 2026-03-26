import {TestBed} from '@angular/core/testing';
import {describe, expect, it} from 'vitest';

import {AuthorSummary} from '../model/author.model';
import {AuthorSelectionService} from './author-selection.service';

describe('AuthorSelectionService', () => {
  const authors: AuthorSummary[] = [
    {id: 1, name: 'Le Guin', bookCount: 4, hasPhoto: true},
    {id: 2, name: 'Butler', bookCount: 2, hasPhoto: false},
    {id: 3, name: 'Cherryh', bookCount: 3, hasPhoto: true},
  ];

  it('selects and deselects single authors', () => {
    TestBed.configureTestingModule({
      providers: [AuthorSelectionService],
    });

    const service = TestBed.inject(AuthorSelectionService);
    service.setCurrentAuthors(authors);

    service.handleCheckboxClick({index: 0, author: authors[0], selected: true, shiftKey: false});
    expect(service.getSelectedIds()).toEqual([1]);
    expect(service.selectedCount()).toBe(1);

    service.handleCheckboxClick({index: 0, author: authors[0], selected: false, shiftKey: false});
    expect(service.getSelectedIds()).toEqual([]);
    expect(service.selectedCount()).toBe(0);
  });

  it('supports shift-selecting a range', () => {
    TestBed.configureTestingModule({
      providers: [AuthorSelectionService],
    });

    const service = TestBed.inject(AuthorSelectionService);
    service.setCurrentAuthors(authors);

    service.handleCheckboxClick({index: 0, author: authors[0], selected: true, shiftKey: false});
    service.handleCheckboxClick({index: 2, author: authors[2], selected: true, shiftKey: true});

    expect(service.getSelectedIds()).toEqual([1, 2, 3]);
  });

  it('supports select-all and deselect-all', () => {
    TestBed.configureTestingModule({
      providers: [AuthorSelectionService],
    });

    const service = TestBed.inject(AuthorSelectionService);
    service.setCurrentAuthors(authors);

    service.selectAll();
    expect(service.getSelectedIds()).toEqual([1, 2, 3]);

    service.deselectAll();
    expect(service.getSelectedIds()).toEqual([]);
    expect(service.selectedCount()).toBe(0);
  });
});
