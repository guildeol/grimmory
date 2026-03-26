import {TestBed} from '@angular/core/testing';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {LocalStorageService} from '../../../shared/service/local-storage.service';
import {AuthorScalePreferenceService} from './author-scale-preference.service';

describe('AuthorScalePreferenceService', () => {
  const localStorageService = {
    get: vi.fn<(key: string) => number | null>(),
    set: vi.fn<(key: string, value: number) => void>(),
  };

  beforeEach(() => {
    vi.useFakeTimers();
    localStorageService.get.mockReset();
    localStorageService.set.mockReset();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    TestBed.resetTestingModule();
  });

  it('loads the initial scale from local storage when it is valid', () => {
    localStorageService.get.mockReturnValue(1.4);

    TestBed.configureTestingModule({
      providers: [
        AuthorScalePreferenceService,
        {provide: LocalStorageService, useValue: localStorageService},
      ],
    });

    const service = TestBed.inject(AuthorScalePreferenceService);

    expect(service.scaleFactor()).toBe(1.4);
  });

  it('falls back to the default scale when storage is empty or invalid', () => {
    localStorageService.get.mockReturnValue(Number.NaN);

    TestBed.configureTestingModule({
      providers: [
        AuthorScalePreferenceService,
        {provide: LocalStorageService, useValue: localStorageService},
      ],
    });

    const service = TestBed.inject(AuthorScalePreferenceService);

    expect(service.scaleFactor()).toBe(1);
  });

  it('debounces writes and skips persisting the same value', () => {
    localStorageService.get.mockReturnValue(1);

    TestBed.configureTestingModule({
      providers: [
        AuthorScalePreferenceService,
        {provide: LocalStorageService, useValue: localStorageService},
      ],
    });

    const service = TestBed.inject(AuthorScalePreferenceService);

    service.setScale(1);
    vi.advanceTimersByTime(1000);
    expect(localStorageService.set).not.toHaveBeenCalled();

    service.setScale(1.2);
    service.setScale(1.6);
    vi.advanceTimersByTime(999);
    expect(localStorageService.set).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(localStorageService.set).toHaveBeenCalledOnce();
    expect(localStorageService.set).toHaveBeenCalledWith('authorScalePreference', 1.6);
    expect(service.scaleFactor()).toBe(1.6);
  });
});
