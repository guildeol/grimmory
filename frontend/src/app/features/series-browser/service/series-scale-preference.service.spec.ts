import {TestBed} from '@angular/core/testing';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {LocalStorageService} from '../../../shared/service/local-storage.service';
import {SeriesScalePreferenceService} from './series-scale-preference.service';

describe('SeriesScalePreferenceService', () => {
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

  it('loads the stored scale when it exists', () => {
    localStorageService.get.mockReturnValue(1.3);

    TestBed.configureTestingModule({
      providers: [
        SeriesScalePreferenceService,
        {provide: LocalStorageService, useValue: localStorageService},
      ],
    });

    const service = TestBed.inject(SeriesScalePreferenceService);

    expect(service.scaleFactor()).toBe(1.3);
  });

  it('falls back to the default scale when storage has no usable value', () => {
    localStorageService.get.mockReturnValue(null);

    TestBed.configureTestingModule({
      providers: [
        SeriesScalePreferenceService,
        {provide: LocalStorageService, useValue: localStorageService},
      ],
    });

    const service = TestBed.inject(SeriesScalePreferenceService);

    expect(service.scaleFactor()).toBe(1);
  });

  it('debounces saves and persists the last changed value', () => {
    localStorageService.get.mockReturnValue(1);

    TestBed.configureTestingModule({
      providers: [
        SeriesScalePreferenceService,
        {provide: LocalStorageService, useValue: localStorageService},
      ],
    });

    const service = TestBed.inject(SeriesScalePreferenceService);

    service.setScale(1.5);
    service.setScale(1.8);
    vi.advanceTimersByTime(1000);

    expect(localStorageService.set).toHaveBeenCalledOnce();
    expect(localStorageService.set).toHaveBeenCalledWith('seriesScalePreference', 1.8);
    expect(service.scaleFactor()).toBe(1.8);
  });
});
