import { useMutation } from '@tanstack/react-query';
import { askQuestion } from '../services/TalkToYourDataService';

export const useAskQuestion = () => {
  return useMutation({
    mutationFn: askQuestion,
  });
};
