import { AggregateRoot, type UniqueEntityID } from '@/core/domain';
import type {
  OriginalUrl,
  ShortCode,
} from '@/link-management/domain/entities/value-objects';
import type { Optional } from '@/shared/types';

export interface LinkProps {
  originalUrl: OriginalUrl;
  shortCode: ShortCode;
  accessCount: number;
  createdAt: Date;
  updatedAt?: Date;
}

export class Link extends AggregateRoot<LinkProps> {
  get originalUrl() {
    return this.props.originalUrl;
  }

  get shortCode() {
    return this.props.shortCode;
  }

  get accessCount() {
    return this.props.accessCount;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  incrementAccessCount(): void {
    this.props.accessCount++;
    this.touch();
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  static create(
    props: Optional<LinkProps, 'createdAt' | 'accessCount'>,
    id?: UniqueEntityID
  ): Link {
    const link = new Link(
      {
        ...props,
        createdAt: props.createdAt || new Date(),
        accessCount: props.accessCount || 0,
      },
      id
    );

    return link;
  }
}
