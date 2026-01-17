import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import postgres from 'postgres';

import { env } from '@/shared/config/env';

export const db = drizzle({
  connection: env.DATABASE_URL,
  casing: 'snake_case',
});

export const pg = postgres(env.DATABASE_URL);
