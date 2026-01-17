import z from 'zod';

export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    message: z.string(),
    cause: z.union([z.string(), z.array(z.any())]).optional(),
  }),
});

export function successResponseSchema(dtoSchema?: z.ZodType) {
  if (!dtoSchema) return z.object({ success: z.literal(true) });

  return z.object({ success: z.literal(true), result: dtoSchema });
}
