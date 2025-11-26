
import { z } from 'zod';

export const generateDataResponseSchema = z.object({
  tableName: z.string(),
  data: z.array(z.string()),
});


