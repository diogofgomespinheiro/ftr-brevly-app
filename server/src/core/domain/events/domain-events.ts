import type { AggregateRoot, UniqueEntityID } from '@/core/domain'
import type { DomainEvent } from './domain-event'

type DomainEventCallback<T extends DomainEvent = DomainEvent> = (
  event: T,
) => void | Promise<void>

export class DomainEvents {
  private static handlersMap: Record<string, DomainEventCallback[]> = {}
  private static markedAggregates: AggregateRoot<unknown>[] = []

  public static markAggregateForDispatch(
    aggregate: AggregateRoot<unknown>,
  ): void {
    const aggregateFound = Boolean(
      DomainEvents.findMarkedAggregateByID(aggregate.id),
    )

    if (!aggregateFound) {
      DomainEvents.markedAggregates.push(aggregate)
    }
  }

  private static dispatchAggregateEvents(
    aggregate: AggregateRoot<unknown>,
  ): void {
    aggregate.domainEvents.map((event: DomainEvent) =>
      DomainEvents.dispatch(event),
    )
  }

  private static removeAggregateFromMarkedDispatchList(
    aggregate: AggregateRoot<unknown>,
  ): void {
    const index = DomainEvents.markedAggregates.findIndex((a) =>
      a.equals(aggregate),
    )
    DomainEvents.markedAggregates.splice(index, 1)
  }

  private static findMarkedAggregateByID(
    id: UniqueEntityID,
  ): AggregateRoot<unknown> | undefined {
    return DomainEvents.markedAggregates.find((aggregate) =>
      aggregate.id.equals(id),
    )
  }

  public static dispatchEventsForAggregate(id: UniqueEntityID): void {
    const aggregate = DomainEvents.findMarkedAggregateByID(id)
    if (!aggregate) return

    DomainEvents.dispatchAggregateEvents(aggregate)
    aggregate.clearEvents()
    DomainEvents.removeAggregateFromMarkedDispatchList(aggregate)
  }

  public static register<T extends DomainEvent>(
    callback: DomainEventCallback<T>,
    eventClassName: string,
  ): void {
    const wasEventRegisteredBefore = eventClassName in DomainEvents.handlersMap
    if (!wasEventRegisteredBefore) {
      DomainEvents.handlersMap[eventClassName] = []
    }

    DomainEvents.handlersMap[eventClassName].push(
      callback as DomainEventCallback,
    )
  }

  public static clearHandlers(): void {
    DomainEvents.handlersMap = {}
  }

  public static clearMarkedAggregates(): void {
    DomainEvents.markedAggregates = []
  }

  private static dispatch(event: DomainEvent): void {
    const eventClassName: string = event.constructor.name
    const isEventRegistered = eventClassName in DomainEvents.handlersMap

    if (isEventRegistered) {
      const handlers = DomainEvents.handlersMap[eventClassName]
      for (const handler of handlers) {
        handler(event)
      }
    }
  }
}
