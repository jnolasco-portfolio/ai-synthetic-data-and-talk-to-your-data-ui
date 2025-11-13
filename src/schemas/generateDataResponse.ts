
import { z } from 'zod';

export const generateDataResponseSchema = z.object({
  tableName: z.string().nonempty(),
  data: z.array(z.string()).min(1),
});

export type GenerateDataResponse = z.infer<typeof generateDataResponseSchema>;
