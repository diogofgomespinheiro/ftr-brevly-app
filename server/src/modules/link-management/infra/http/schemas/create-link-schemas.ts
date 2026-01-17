import z from 'zod';

export const createLinkRequestSchema = z.object({
  original_url: z.string(),
  short_code: z.string(),
});

export type CreateLinkRequestDTO = z.infer<typeof createLinkRequestSchema>;
