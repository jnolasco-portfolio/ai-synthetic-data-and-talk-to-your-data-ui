import * as z from 'zod';

export const generateDataResponseSchema = z.object({
  conversationId: z.string().min(1, 'Conversation ID is required'),
  question: z.string().min(1, 'Question is required'),
  schemaName: z.string().min(1, 'Schema name is required')
});