import { z } from 'zod';

export const QuestionResponseSchema = z.object({
  conversationId: z.string(),
  question: z.string(),
  sqlQuery: z.string(),
  result: z.array(z.record(z.string(), z.any())),
});

export type QuestionResponse = z.infer<typeof QuestionResponseSchema>;
