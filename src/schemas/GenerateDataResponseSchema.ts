
import { z } from 'zod';

export const generateDataResponseSchema = z.object({
  tableName: z.string(),
  data: z.array(z.string()),
});


export type GenerateDataResponse = z.infer<typeof generateDataResponseSchema>;