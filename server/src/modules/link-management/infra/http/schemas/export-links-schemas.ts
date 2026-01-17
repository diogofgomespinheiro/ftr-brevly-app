import z from 'zod';

export const exportLinksResponseSchema = z.object({
  report_url: z.string(),
});
