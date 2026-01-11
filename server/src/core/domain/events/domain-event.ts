import type { UniqueEntityID } from '@/core/domain'

export abstract class DomainEvent {
  public occurredAt: Date

  constructor() {
    this.occurredAt = new Date()
  }

  abstract getAggregateId(): UniqueEntityID
}
