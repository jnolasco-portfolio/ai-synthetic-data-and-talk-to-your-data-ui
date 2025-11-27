import * as z from 'zod';

export const QuestionFormSchema = z.object({
  conversationId: z.string().min(1, 'Conversation ID is required'),
  question: z.string().min(1, 'Question is required'),
  schemaName: z.string().min(1, 'Schema name is required')
});

export type QuestionFormValues = z.infer<typeof QuestionFormSchema>;

export const QuestionFormDefaults: QuestionFormValues = {
  conversationId: '123456789',
  question: '',
  schemaName: 'library'
};