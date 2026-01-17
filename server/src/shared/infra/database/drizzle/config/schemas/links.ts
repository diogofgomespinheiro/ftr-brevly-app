import type { InferSelectModel } from 'drizzle-orm';
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { v7 as uuid } from 'uuid';

export const linksTable = pgTable('links', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuid()),
  originalUrl: text('original_url').notNull(),
  shortCode: text('short_code').notNull().unique(),
  accessCount: integer('access_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export type DrizzleLink = InferSelectModel<typeof linksTable>;
export type DrizzleLinkRaw = {
  id: string;
  original_url: string;
  short_code: string;
  access_count: number | null;
  created_at: Date;
  updated_at: Date | null;
};
