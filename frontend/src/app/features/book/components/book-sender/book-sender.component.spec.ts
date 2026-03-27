import {describe, it} from 'vitest';

// NOTE(frontend-seam): Real coverage here needs seams around dialog bootstrapping, provider and
// recipient option loading, and toast side effects so send-book branching can be asserted without
// the full dialog and select-widget runtime.
describe.skip('BookSenderComponent', () => {
  it('needs option-loading seams to verify emailable file selection and large-file warnings', () => {
    // TODO(seam): Cover buildEmailableFiles, provider/recipient loading, and warning visibility after dialog data and select controls are isolated behind deterministic doubles.
  });

  it('needs email and toast seams to verify success, validation failures, and backend errors', () => {
    // TODO(seam): Cover sendBook once email-service requests and message dispatch can be asserted without mounting the PrimeNG dialog runtime.
  });
});
