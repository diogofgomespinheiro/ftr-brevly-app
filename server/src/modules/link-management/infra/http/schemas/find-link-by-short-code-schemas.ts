import z from 'zod';

export const findLinkByShortCodeParamsSchema = z.object({
  short_code: z.string(),
});

export const findLinkByShortCodeResponseSchema = z.object({
  link: z.object({
    id: z.uuidv7(),
    original_url: z.string(),
    short_code: z.string(),
    access_count: z.number().default(0),
    created_at: z.string(),
    updated_at: z.string().optional(),
  }),
});

export type FindLinkByShortCodeRequestDTO = z.infer<
  typeof findLinkByShortCodeParamsSchema
>;
