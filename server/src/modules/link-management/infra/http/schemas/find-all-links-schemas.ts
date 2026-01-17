import z from 'zod';

export const findAllLinksResponseSchema = z.object({
  links: z.array(
    z.object({
      id: z.uuidv7(),
      original_url: z.string(),
      short_code: z.string(),
      access_count: z.number().default(0),
      created_at: z.string(),
      updated_at: z.string().optional(),
    })
  ),
});
