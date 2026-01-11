import { AggregateRoot } from "@/core/domain";
import type {
	OriginalUrl,
	ShortCode,
} from "@/link-management/domain/entities/value-objects";

export interface LinkProps {
	originalUrl: OriginalUrl;
	shortCode: ShortCode;
	accessCount: number;
	createdAt: Date;
	updatedAt?: Date;
}

export class Link extends AggregateRoot<LinkProps> {}
