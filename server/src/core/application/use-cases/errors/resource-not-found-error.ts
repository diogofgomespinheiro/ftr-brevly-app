import type { UseCaseError } from './use-case-error'

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor(cause?: string) {
    super('Resource not found', { cause })
    this.name = 'ResourceNotFoundError'
  }
}
