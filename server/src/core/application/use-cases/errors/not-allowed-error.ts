import type { UseCaseError } from './use-case-error';

export class NotAllowedError extends Error implements UseCaseError {
  constructor(cause?: string) {
    super('NOT_ALLOWED_ERROR', { cause });
    this.name = 'NotAllowedError';
  }
}
