import { z } from 'zod';

export const learnDatabaseRequestSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').optional(),
  temperature: z.number().min(0).max(1).default(0.2),
  maxRows: z.number().int().min(1).default(20),
  // file validation
  schemaUpload: z
    .instanceof(FileList)
    .refine(
      (files) => (files.length > 0 ? files[0].size <= 5 * 1024 * 1024 : true),
      {
        message: 'File must be ≤ 5 MB',
      }
    )
    .refine(
      (files) =>
        files.length > 0 ? /\.(sql|txt|ddl)$/i.test(files[0].name) : true,
      {
        message: 'Supported formats: .sql, .txt, .ddl',
      }
    )
    .optional(),
});

export type LearnDatabaseRequest = z.infer<typeof learnDatabaseRequestSchema>;