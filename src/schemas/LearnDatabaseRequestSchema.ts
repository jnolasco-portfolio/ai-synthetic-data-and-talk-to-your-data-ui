import { z } from 'zod';

export const learnDatabaseRequestSchema = z
  .object({
    conversationId: z.string().min(1, 'Conversation ID is required'),
    schemaFileName: z.string().optional(),
    parameters: z.object({
      prompt: z.string(),
      temperature: z.number().min(0).max(1),
      maxRows: z.number().min(1).max(1000),
    }),
    schemaUpload: z
      .instanceof(FileList)
      .optional()
      .refine(
        (files) =>
          files && files.length > 0
            ? files[0].size <= 5 * 1024 * 1024
            : true,
        {
          message: 'File must be ≤ 5 MB',
        }
      )
      .refine(
        (files) =>
          files && files.length > 0
            ? /\.(sql|txt|ddl)$/i.test(files[0].name)
            : true,
        {
          message: 'Supported formats: .sql, .txt, .ddl',
        }
      ),
  })
  .superRefine((data, ctx) => {
    if (data.schemaUpload && data.schemaUpload.length > 0) {
      if (!data.schemaFileName || data.schemaFileName.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['schemaFileName'],
          message: 'Schema file name is required when a file is uploaded.',
        });
      }
    }
  });

export type LearnDatabaseRequest = z.infer<typeof learnDatabaseRequestSchema>;
