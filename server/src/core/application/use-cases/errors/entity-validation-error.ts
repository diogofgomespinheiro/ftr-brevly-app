import type { UseCaseError } from './use-case-error';

export class EntityValidationError extends Error implements UseCaseError {
  constructor(cause: string) {
    super('Entity Validation Error', { cause });
    this.name = 'EntityValidationError';
  }
}
