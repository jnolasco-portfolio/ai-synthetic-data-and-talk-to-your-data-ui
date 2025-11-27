import * as z from 'zod';

export const QuestionRequestSchema = z.object({
  conversationId: z.string().min(1, 'Conversation ID is required'),
  question: z.string().min(1, 'Question is required'),
  schemaName: z.string().min(1, 'Schema name is required')
});

export type QuestionRequest = z.infer<typeof QuestionRequestSchema>;

export const QuestionRequestDefaults: QuestionRequest = {
  conversationId: '123456789',
  question: '',
  schemaName: 'library'
};