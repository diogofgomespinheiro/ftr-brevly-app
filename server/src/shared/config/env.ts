import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  DATABASE_URL: z.url().startsWith('postgres://'),

  CLOUDFLARE_ACCOUNT_ID: z.string(),
  CLOUDFLARE_ACCESS_KEY_ID: z.string(),
  CLOUDFLARE_SECRET_ACCESS_KEY: z.string(),
  CLOUDFLARE_BUCKET_NAME: z.string(),
  CLOUDFLARE_PUBLIC_URL: z.url(),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error(
    '❌ Invalid environment variables:',
    JSON.stringify(z.treeifyError(_env.error))
  );

  throw new Error('Invalid environment variables.', _env.error);
}

export const env = _env.data;
