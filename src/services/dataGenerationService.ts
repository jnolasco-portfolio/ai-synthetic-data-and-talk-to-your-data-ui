import * as z from 'zod';
import type { generateDataRequestSchema } from '../schemas/generateDataRequest';
import { httpClient } from './httpClient';
import { generateDataResponseSchema } from '../schemas/generateDataResponse';
import { learnDatabaseResponseSchema } from '../schemas/learnDatabaseResponse';
import type { learnDatabaseRequestSchema } from '../schemas/learnDatabaseRequest';

export type GenerateDataRequest = z.infer<typeof generateDataRequestSchema>;
export type GenerateDataResponse = z.infer<typeof generateDataResponseSchema>;
export type LearnDatabaseRequest = z.infer<typeof learnDatabaseRequestSchema>;
export type LearnDatabaseResponse = z.infer<typeof learnDatabaseResponseSchema>;

class DataGenerationService {

  postLearnSchemaClient = async (
    formData: FormData
  ): Promise<LearnDatabaseResponse> => {
    const { data } = await httpClient.post<LearnDatabaseResponse>(
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

  // fetchGenerateData
  fetchGenerateData = async (
    request: GenerateDataRequest
  ): Promise<GenerateDataResponse> => {
    const { data } = await httpClient.post<GenerateDataResponse>(
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

}

export default new DataGenerationService;