import { z } from 'zod';

export const QuestionResponseSchema = z.object({
  id: z.string().nonempty(),
  conversationId: z.string(),
  question: z.string(),
  sqlQuery: z.string(),
  result: z.array(z.record(z.string(), z.any())),
});

export type QuestionResponse = z.infer<typeof QuestionResponseSchema>;
