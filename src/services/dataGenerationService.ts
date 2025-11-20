import * as z from 'zod';
import type { generateDataRequestSchema } from '../schemas/generateDataRequest';
import { generateDataResponseSchema } from '../schemas/generateDataResponse';
import type { learnDatabaseRequestSchema } from '../schemas/learnDatabaseRequest';
import { learnDatabaseResponseSchema } from '../schemas/learnDatabaseResponse';
import { httpClient } from './httpClient';

export type GenerateDataRequest = z.infer<typeof generateDataRequestSchema>;
export type GenerateDataResponse = z.infer<typeof generateDataResponseSchema>;
export type LearnDatabaseRequest = z.infer<typeof learnDatabaseRequestSchema>;
export type LearnDatabaseResponse = z.infer<typeof learnDatabaseResponseSchema>;
class DataGenerationService {

  /**
     * Retrieve the JSON representation of database learnings.
     */
  async fetchDatabaseLearnings(
    formData: FormData
  ): Promise<LearnDatabaseResponse> {
    const { data } = await httpClient.post<LearnDatabaseResponse>(
      '/learn',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const result = learnDatabaseResponseSchema.safeParse(data);
    if (!result.success) {
      console.error('API Response Validation Error:', result.error);
      throw new Error('Invalid data received from the server.');
    }
    return result.data;
  }
  // fetchGenerateData
  async fetchGeneratedData(
    request: GenerateDataRequest
  ): Promise<GenerateDataResponse> {
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