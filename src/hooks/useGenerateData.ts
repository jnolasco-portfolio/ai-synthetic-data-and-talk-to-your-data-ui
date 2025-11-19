import { useMutation } from '@tanstack/react-query';
import dataGenerationService from '../services/dataGenerationService';

export const useGenerateData = () => {
  return useMutation({
    mutationFn: dataGenerationService.fetchGeneratedData,
    onSuccess: (data) => {
      console.log('Generation successful:', data);
      // You can add state updates or notifications here
    },
    onError: (error) => {
      console.error('Generation error:', error);
      // You can add error handling or notifications here
    },
  });
};
