import { z } from 'zod';
import { learnDatabaseResponseSchema } from './LearnDatabaseResponseSchema';

export const generateDataRequestSchema = z.object({
  conversationId: z.string(),
  tableName: z.string(),
  instructions: z.string(),
  maxRows: z.number().int().min(1),
  schema: learnDatabaseResponseSchema,
});

