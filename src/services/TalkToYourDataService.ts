import type { QuestionRequest } from '../schemas/QuestionRequestSchema';
import type { QuestionResponse } from '../schemas/QuestionResponseSchema';
import { httpClient } from './httpClient';

//export type QuestionRequest = z.infer<typeof QuestionFormValues>;
//export type QuestionResponse = z.infer<typeof QuestionResponseSchema>;

export const askQuestion = async (
  request: QuestionRequest
): Promise<QuestionResponse> => {
  const { data } = await httpClient.post<QuestionResponse>(
    '/questions',
    request
  );
  return data;
};
