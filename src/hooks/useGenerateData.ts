import { useMutation } from '@tanstack/react-query';
import { axiosInstance } from '../api/api';
import {
  generateDataResponseSchema,
  type GenerateDataResponse,
} from '../schemas/generateDataResponse';
import { type GenerateDataRequest } from '../schemas/generateDataRequest';

const fetchGenerateData = async (
  request: GenerateDataRequest
): Promise<GenerateDataResponse> => {
  const { data } = await axiosInstance.post<GenerateDataResponse>(
    '/generate',
    request,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const validationResult = generateDataResponseSchema.safeParse(data);

  if (!validationResult.success) {
    // Log the error and throw to be caught by React Query
    console.error('API Response Validation Error:', validationResult.error);
    throw new Error('Invalid data received from the server.');
  }

  return validationResult.data;
};

export const useGenerateData = () => {
  return useMutation({
    mutationFn: fetchGenerateData,
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
