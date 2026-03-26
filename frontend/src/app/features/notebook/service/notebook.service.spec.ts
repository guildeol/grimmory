import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';

import {API_CONFIG} from '../../../core/config/api-config';
import {NotebookService} from './notebook.service';

describe('NotebookService', () => {
  let service: NotebookService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        NotebookService,
      ],
    });

    service = TestBed.inject(NotebookService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    TestBed.resetTestingModule();
  });

  it('requests notebook entries with trimmed search and repeated type params', () => {
    service.getNotebookEntries(1, 20, ['NOTE', 'HIGHLIGHT'], 42, '  galaxy  ', 'createdAt,desc').subscribe();

    const request = httpTestingController.expectOne(req =>
      req.url === `${API_CONFIG.BASE_URL}/api/v1/notebook`
      && req.params.get('page') === '1'
      && req.params.get('size') === '20'
      && req.params.get('sort') === 'createdAt,desc'
      && req.params.get('bookId') === '42'
      && req.params.get('search') === 'galaxy'
      && req.params.getAll('types')?.join(',') === 'NOTE,HIGHLIGHT'
    );

    expect(request.request.method).toBe('GET');
    request.flush({content: [], page: {totalElements: 0, totalPages: 0, number: 1, size: 20}});
  });

  it('requests export entries without optional filters when they are absent', () => {
    service.getExportEntries(['BOOKMARK'], null, '   ', 'updatedAt,asc').subscribe();

    const request = httpTestingController.expectOne(req =>
      req.url === `${API_CONFIG.BASE_URL}/api/v1/notebook/export`
      && req.params.get('sort') === 'updatedAt,asc'
      && req.params.get('bookId') === null
      && req.params.get('search') === null
      && req.params.getAll('types')?.join(',') === 'BOOKMARK'
    );

    expect(request.request.method).toBe('GET');
    request.flush([]);
  });

  it('searches books with annotations only when a trimmed query is present', () => {
    service.getBooksWithAnnotations('  dune  ').subscribe();

    const request = httpTestingController.expectOne(req =>
      req.url === `${API_CONFIG.BASE_URL}/api/v1/notebook/books`
      && req.params.get('search') === 'dune'
    );

    expect(request.request.method).toBe('GET');
    request.flush([]);
  });
});
