import { describe, expect, it, vi } from 'vitest';

import { AggregateRoot, type UniqueEntityID } from '@/core/domain';
import { type DomainEvent, DomainEvents } from '@/core/domain/events';

class CustomAggregateCreated implements DomainEvent {
  private aggregate: CustomAggregate;
  public occurredAt: Date;

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate;
    this.occurredAt = new Date();
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id;
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null);

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));
    return aggregate;
  }
}

describe('domain events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn();
    const aggregate = CustomAggregate.create();

    DomainEvents.register(callbackSpy, CustomAggregateCreated.name);
    expect(aggregate.domainEvents).toHaveLength(1);

    DomainEvents.dispatchEventsForAggregate(aggregate.id);
    expect(callbackSpy).toHaveBeenCalled();
    expect(aggregate.domainEvents).toHaveLength(0);
  });
});
