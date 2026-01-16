import { Link } from '@/link-management/domain/entities';
import {
  OriginalUrl,
  ShortCode,
} from '@/link-management/domain/entities/value-objects';
import type { DrizzleLink } from '@/shared/infra/database/drizzle/config/schemas/links';

export class DrizzleLinksMapper {
  static toDomain(raw: DrizzleLink): Link {
    const originalUrl = OriginalUrl.create(raw.originalUrl);
    const shortCode = ShortCode.create(raw.shortCode);

    return Link.create({
      originalUrl: originalUrl.getValue(),
      shortCode: shortCode.getValue(),
      accessCount: raw.accessCount || undefined,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt || undefined,
    });
  }

  static toDrizzle(link: Link): DrizzleLink {
    return {
      id: link.id.toString(),
      originalUrl: link.originalUrl.value,
      shortCode: link.shortCode.value,
      accessCount: link.accessCount,
      createdAt: link.createdAt,
      updatedAt: link.updatedAt || null,
    };
  }
}
