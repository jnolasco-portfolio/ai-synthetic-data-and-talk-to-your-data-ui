import { useMutation } from '@tanstack/react-query';
import dataGenerationService from '../services/dataGenerationService';

export const useLearnDatabase = () => {
  return useMutation({
    mutationFn: (formData: FormData) => dataGenerationService.postLearnSchemaClient(formData),
    onSuccess: (response) => {
      console.log('Schema learning successful:', response);
      // You can add state updates or notifications here
    },
    onError: (error) => {
      console.error('Schema learning error:', error);
      // You can add error handling or notifications here
    },
  });
};