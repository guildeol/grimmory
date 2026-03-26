import {TestBed} from '@angular/core/testing';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {firstValueFrom} from 'rxjs';

import en from '../../../i18n/en';
import de from '../../../i18n/de';
import {AVAILABLE_LANGS, EN_TRANSLATIONS, LANG_LABELS, TranslocoInlineLoader} from './transloco-loader';

describe('TranslocoInlineLoader', () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [TranslocoInlineLoader],
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('returns the english translations for the default language', async () => {
    const loader = TestBed.inject(TranslocoInlineLoader);
    const translation = await firstValueFrom(loader.getTranslation('en'));

    expect(translation).toBe(EN_TRANSLATIONS);
    expect(translation['auth']['login']['sessionRevoked']).toBe(en['auth']['login']['sessionRevoked']);
  });

  it('falls back to english for unsupported languages', async () => {
    const loader = TestBed.inject(TranslocoInlineLoader);
    const translation = await firstValueFrom(loader.getTranslation('xx'));

    expect(translation).toBe(EN_TRANSLATIONS);
  });

  it('loads and merges a lazy language bundle over english', async () => {
    const loader = TestBed.inject(TranslocoInlineLoader);
    const translation = await firstValueFrom(loader.getTranslation('de'));

    expect(translation['auth']['login']['oidcInitError']).toBe(de['auth']['login']['oidcInitError']);
    expect(translation['auth']['login']['sessionRevoked']).toBe(de['auth']['login']['sessionRevoked']);
    expect(translation['auth']['login']['oidcErrors']['providerUnreachable']).toBe(de['auth']['login']['oidcErrors']['providerUnreachable']);
  });

  it('exposes the available language metadata', () => {
    expect(AVAILABLE_LANGS).toContain('en');
    expect(AVAILABLE_LANGS).toContain('de');
    expect(LANG_LABELS['en']).toBe('English');
    expect(LANG_LABELS['de']).toBe('Deutsch');
  });
});
