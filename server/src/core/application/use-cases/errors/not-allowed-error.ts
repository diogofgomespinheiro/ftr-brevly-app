import type { UseCaseError } from './use-case-error'

export class NotAllowedError extends Error implements UseCaseError {
  constructor(cause?: string) {
    super('Not allowed', { cause })
    this.name = 'NotAllowedError'
  }
}
