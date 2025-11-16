
import { z } from 'zod';
import { learnDatabaseResponseSchema } from './learnDatabaseResponse';

export const generateDataResponseSchema = z.object({
  schema: learnDatabaseResponseSchema,
  data: z.record(z.string(), z.array(z.string())),
});

export type GenerateDataResponse = z.infer<typeof generateDataResponseSchema>;
