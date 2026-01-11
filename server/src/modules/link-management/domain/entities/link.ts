import { AggregateRoot } from '@/core/domain';
import type { OriginalUrl } from '@/link-management/domain/entities/value-objects';

export interface LinkProps {
  originalUrl: OriginalUrl;
  shortCode: string;
  accessCount: number;
  createdAt: Date;
  updatedAt?: Date;
}

export class Link extends AggregateRoot<LinkProps> {}
