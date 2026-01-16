import { defineConfig } from 'drizzle-kit';
import { env } from '@/shared/config/env';

export default defineConfig({
  dialect: 'postgresql',
  schema: 'src/shared/infra/database/drizzle/config/schemas/*',
  out: 'src/shared/infra/database/drizzle/config/migrations',
  casing: 'snake_case',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
