import type { UseCaseError } from './use-case-error';

export class UnexpectedError extends Error implements UseCaseError {
  constructor() {
    super('UNEXPECTED_ERROR');
    this.name = 'UnexpectedError';
  }
}
