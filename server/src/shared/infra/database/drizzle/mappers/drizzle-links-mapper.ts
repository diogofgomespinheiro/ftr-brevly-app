import { UniqueEntityID } from '@/core/domain';
import { Link } from '@/link-management/domain/entities';
import {
  OriginalUrl,
  ShortCode,
} from '@/link-management/domain/entities/value-objects';
import type {
  DrizzleLink,
  DrizzleLinkRaw,
} from '@/shared/infra/database/drizzle/config/schemas/links';

export class DrizzleLinksMapper {
  static toDomain(link: DrizzleLink): Link {
    const originalUrl = OriginalUrl.create(link.originalUrl);
    const shortCode = ShortCode.create(link.shortCode);

    return Link.create(
      {
        originalUrl: originalUrl.getValue(),
        shortCode: shortCode.getValue(),
        accessCount: link.accessCount || undefined,
        createdAt: link.createdAt,
        updatedAt: link.updatedAt || undefined,
      },
      UniqueEntityID.create(link.id)
    );
  }

  static toDomainFromRaw(raw: DrizzleLinkRaw): Link {
    const originalUrl = OriginalUrl.create(raw.original_url);
    const shortCode = ShortCode.create(raw.short_code);

    return Link.create(
      {
        originalUrl: originalUrl.getValue(),
        shortCode: shortCode.getValue(),
        accessCount: raw.access_count || undefined,
        createdAt: raw.created_at,
        updatedAt: raw.updated_at || undefined,
      },
      UniqueEntityID.create(raw.id)
    );
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
