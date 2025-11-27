import { useMutation } from '@tanstack/react-query';
import { askQuestion } from '../services/TalkToYourDataService';
import type { QuestionRequest } from '../schemas/QuestionRequestSchema';
import type { QuestionResponse } from '../schemas/QuestionResponseSchema';

interface UseAskQuestionOptions {
  onSuccess?: (data: QuestionResponse, variables: QuestionRequest, context: unknown) => void;
  onError?: (error: Error, variables: QuestionRequest, context: unknown) => void;
}

export const useAskQuestion = (options?: UseAskQuestionOptions) => {
  return useMutation({
    mutationFn: askQuestion,
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};
