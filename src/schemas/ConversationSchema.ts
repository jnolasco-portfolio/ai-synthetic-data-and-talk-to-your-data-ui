import * as z from 'zod';

export const conversationSchema = z.object({
  conversationId: z.string(),
  name: z.string(),
});

export type Conversation = z.infer<typeof conversationSchema>;
