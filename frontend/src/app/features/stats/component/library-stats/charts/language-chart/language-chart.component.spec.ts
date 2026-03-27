import {describe, it} from 'vitest';

// NOTE(frontend-seam): Real coverage here needs seams around computed pie-chart output,
// language-name normalization, and translated tooltip callbacks so language distribution can be
// asserted without relying on Chart.js metadata internals.
describe.skip('LanguageChartComponent', () => {
  it('needs normalization seams to verify language-code mapping, unknown-language fallback, and library filtering', () => {
    // TODO(seam): Cover calculateLanguageStats once the computed chart state is isolated behind a deterministic adapter.
  });

  it('needs callback seams to verify translated tooltip labels and color assignment across many languages', () => {
    // TODO(seam): Cover chartData and chartOptions after extracting Chart.js callback metadata from the component runtime.
  });
});
