import type { UseCaseError } from './use-case-error';

export class EntityValidationError extends Error implements UseCaseError {
  constructor(cause: string) {
    super('ENTITY_VALIDATION_ERROR', { cause });
    this.name = 'EntityValidationError';
  }
}
