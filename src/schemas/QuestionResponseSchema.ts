import { z } from 'zod';

export const QuestionResponseSchema = z.object({
  id: z.string().nonempty(),
  conversationId: z.string(),
  question: z.string(),
  sqlQuery: z.string(),
  metadata: z.object({
    content_type: z.enum(['bar', 'pie', 'line', 'table']),
    category_key: z.string().nullable(),
    value_key: z.string().nullable(),
  }),
  result: z.array(z.record(z.string(), z.any())),
});

export type QuestionResponse = z.infer<typeof QuestionResponseSchema>;
