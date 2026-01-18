import type { UseCaseError } from './use-case-error';

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor(cause?: string) {
    super('RESOURCE_NOT_FOUND_ERROR', { cause });
    this.name = 'ResourceNotFoundError';
  }
}
