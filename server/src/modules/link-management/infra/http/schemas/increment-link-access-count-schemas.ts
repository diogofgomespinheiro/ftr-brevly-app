import z from 'zod';

export const incrementLinkAccessCountParamsSchema = z.object({
  short_code: z.string(),
});

export type IncrementLinkAccessCountRequestDTO = z.infer<
  typeof incrementLinkAccessCountParamsSchema
>;
