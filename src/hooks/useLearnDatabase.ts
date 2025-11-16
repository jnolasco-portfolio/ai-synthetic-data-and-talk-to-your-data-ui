import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '../api/api';
import {
  learnDatabaseResponseSchema,
  type LearnDatabaseResponse,
} from '../schemas/learnDatabaseResponse';

// TODO: refactor in a service
const postLearnSchemaClient = async (
  formData: FormData
): Promise<LearnDatabaseResponse> => {
  const { data } = await axiosInstance.post<LearnDatabaseResponse>(
    '/learn',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  const validationResult = learnDatabaseResponseSchema.safeParse(data);

  if (!validationResult.success) {
    // Log the error and throw to be caught by React Query
    console.error('API Response Validation Error:', validationResult.error);
    throw new Error('Invalid data received from the server.');
  }

  return validationResult.data;
};

export const useLearnDatabase = () => {
  return useMutation({
    mutationFn: (formData: FormData) => postLearnSchemaClient(formData),
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