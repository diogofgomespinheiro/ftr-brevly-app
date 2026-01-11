import type { UseCaseError } from './use-case-error'

export class ConflictError extends Error implements UseCaseError {
  constructor(cause?: string) {
    super('Conflict', { cause })
    this.name = 'ConflictError'
  }
}
