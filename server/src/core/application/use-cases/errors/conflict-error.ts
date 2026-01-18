import type { UseCaseError } from './use-case-error';

export class ConflictError extends Error implements UseCaseError {
  constructor(cause?: string) {
    super('CONFLICT_ERROR', { cause });
    this.name = 'ConflictError';
  }
}
