import { eq } from 'drizzle-orm';

import type { LinksRepository } from '@/link-management/application/repositories';
import type { Link } from '@/link-management/domain/entities';
import { db, pg } from '@/shared/infra/database/drizzle/config';
import { schema } from '@/shared/infra/database/drizzle/config/schemas';
import type { DrizzleLink } from '@/shared/infra/database/drizzle/config/schemas/links';
import { DrizzleLinksMapper } from '@/shared/infra/database/drizzle/mappers';

export class DrizzleLinksRepository implements LinksRepository {
  async create(link: Link) {
    await db
      .insert(schema.linksTable)
      .values(DrizzleLinksMapper.toDrizzle(link));
  }

  async findByShortCode(shortCode: string): Promise<Link | null> {
    const result = await db
      .select()
      .from(schema.linksTable)
      .where(eq(schema.linksTable.shortCode, shortCode));

    if (!result.length) return null;
    return DrizzleLinksMapper.toDomain(result[0]);
  }

  async findById(id: string): Promise<Link | null> {
    const result = await db
      .select()
      .from(schema.linksTable)
      .where(eq(schema.linksTable.id, id));

    if (!result.length) return null;
    return DrizzleLinksMapper.toDomain(result[0]);
  }

  async findMany(): Promise<Link[]> {
    const result = await db.select().from(schema.linksTable);
    return result.map(item => DrizzleLinksMapper.toDomain(item));
  }

  async delete(shortCode: string): Promise<void> {
    await db
      .delete(schema.linksTable)
      .where(eq(schema.linksTable.shortCode, shortCode));
  }

  async update(link: Link): Promise<void> {
    await db
      .update(schema.linksTable)
      .set(DrizzleLinksMapper.toDrizzle(link))
      .where(eq(schema.linksTable.id, link.id.toString()));
  }

  async *createExportStream(): AsyncIterable<Link> {
    const { sql, params } = db.select().from(schema.linksTable).toSQL();

    const cursor = pg.unsafe<DrizzleLink[]>(sql, params as string[]).cursor(2);

    for await (const rows of cursor) {
      for (const row of rows) {
        yield DrizzleLinksMapper.toDomain(row);
      }
    }
  }
}
