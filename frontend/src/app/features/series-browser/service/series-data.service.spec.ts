import {signal} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {describe, expect, it} from 'vitest';

import {Book, ReadStatus} from '../../book/model/book.model';
import {BookService} from '../../book/service/book.service';
import {SeriesDataService} from './series-data.service';

describe('SeriesDataService', () => {
  const createBook = (overrides: Partial<Book>): Book => ({
    id: 1,
    libraryId: 1,
    libraryName: 'Main Library',
    fileName: 'book.epub',
    metadata: {
      bookId: 1,
      title: 'Book',
      authors: [],
      categories: [],
      ...overrides.metadata,
    },
    ...overrides,
  });

  it('builds grouped and sorted series summaries', () => {
    const books = signal<Book[]>([
      createBook({
        id: 1,
        addedOn: '2025-01-01T00:00:00Z',
        lastReadTime: '2025-02-01T00:00:00Z',
        readStatus: ReadStatus.READ,
        metadata: {
          bookId: 1,
          title: 'Second',
          seriesName: ' Saga ',
          seriesNumber: 2,
          authors: ['Le Guin'],
          categories: ['Fantasy'],
        },
      }),
      createBook({
        id: 2,
        addedOn: '2025-03-01T00:00:00Z',
        lastReadTime: '2025-03-02T00:00:00Z',
        readStatus: ReadStatus.READING,
        metadata: {
          bookId: 2,
          title: 'First',
          seriesName: 'saga',
          seriesNumber: 1,
          authors: ['Le Guin', 'Butler'],
          categories: ['Fantasy', 'Sci-Fi'],
        },
      }),
      createBook({
        id: 3,
        readStatus: ReadStatus.UNREAD,
        metadata: {
          bookId: 3,
          title: 'Standalone',
          authors: ['Cherryh'],
          categories: ['Sci-Fi'],
        },
      }),
    ]);

    TestBed.configureTestingModule({
      providers: [
        SeriesDataService,
        {provide: BookService, useValue: {books}},
      ],
    });

    const service = TestBed.inject(SeriesDataService);
    const [summary] = service.allSeries();

    expect(service.allSeries()).toHaveLength(1);
    expect(summary.seriesName).toBe('saga');
    expect(summary.books.map(book => book.id)).toEqual([2, 1]);
    expect(summary.authors).toEqual(['Le Guin', 'Butler']);
    expect(summary.categories).toEqual(['Fantasy', 'Sci-Fi']);
    expect(summary.bookCount).toBe(2);
    expect(summary.readCount).toBe(1);
    expect(summary.progress).toBe(0.5);
    expect(summary.seriesStatus).toBe(ReadStatus.READING);
    expect(summary.nextUnread?.id).toBe(2);
    expect(summary.lastReadTime).toBe('2025-03-02T00:00:00Z');
    expect(summary.addedOn).toBe('2025-03-01T00:00:00Z');
    expect(summary.coverBooks.map(book => book.id)).toEqual([2, 1]);
  });

  it('derives status precedence from the grouped books', () => {
    const books = signal<Book[]>([
      createBook({
        id: 4,
        readStatus: ReadStatus.WONT_READ,
        metadata: {bookId: 4, title: 'Skipped', seriesName: 'Orbit', seriesNumber: 1},
      }),
      createBook({
        id: 5,
        readStatus: ReadStatus.READ,
        metadata: {bookId: 5, title: 'Finished', seriesName: 'Orbit', seriesNumber: 2},
      }),
    ]);

    TestBed.configureTestingModule({
      providers: [
        SeriesDataService,
        {provide: BookService, useValue: {books}},
      ],
    });

    const service = TestBed.inject(SeriesDataService);

    expect(service.allSeries()[0].seriesStatus).toBe(ReadStatus.WONT_READ);
  });
});
