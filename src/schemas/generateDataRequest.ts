import { z } from 'zod';
import { learnDatabaseResponseSchema } from './learnDatabaseResponse';

export const generateDataRequestSchema = z.object({
  conversationId: z.string(),
  tableName: z.string(),
  instructions: z.string(),
  maxRows: z.number().int().min(1),
  schema: learnDatabaseResponseSchema,
});

export type GenerateDataRequest = z.infer<typeof generateDataRequestSchema>;