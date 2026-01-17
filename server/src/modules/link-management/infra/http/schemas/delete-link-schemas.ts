import z from 'zod';

export const deleteLinkParamsSchema = z.object({
  short_code: z.string(),
});

export type DeleteLinkRequestDTO = z.infer<typeof deleteLinkParamsSchema>;
