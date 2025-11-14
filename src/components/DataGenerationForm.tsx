import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGenerateData } from '../hooks/useGenerateData';

const dataGenerationSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
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

type DataGenerationFormFields = z.infer<typeof dataGenerationSchema>;

function DataGenerationForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DataGenerationFormFields>({
    resolver: zodResolver(dataGenerationSchema),
    defaultValues: {
      prompt: '',
      temperature: 0.2,
      maxRows: 20,
      schemaUpload: undefined,
    },
  });

  const schemaFile = watch('schemaUpload');
  const { mutate, isPending } = useGenerateData();

  const onSubmit = (data: DataGenerationFormFields) => {
    const formData = new FormData();
    formData.append('prompt', data.prompt);
    formData.append('temperature', data.temperature.toString());
    formData.append('maxRows', data.maxRows.toString());
    if (data.schemaUpload && data.schemaUpload.length > 0) {
      formData.append('schemaUpload', data.schemaUpload[0]);
    }
    mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor='prompt'>Prompt</label>
        <input
          type='text'
          id='prompt'
          placeholder='Enter your prompt here...'
          {...register('prompt')}
        />
        {errors.prompt && (
          <span className='error-message'>{errors.prompt.message}</span>
        )}
      </div>

      <div className='upload-schema-group'>
        <label htmlFor='schema-upload' role='button'>
          Upload DDL Schema
        </label>
        <input
          hidden
          type='file'
          id='schema-upload'
          accept='.sql,.txt,.ddl'
          className='sr-only'
          {...register('schemaUpload')}
        />
        <span>
          {schemaFile && schemaFile.length > 0
            ? 'Selected file: ' + schemaFile[0].name
            : 'Supported formats: SQL.'}
        </span>
      </div>
      <div className='mb-1'></div>
      <fieldset>
        <legend>Advanced Parameters</legend>

        <section className='advanced'>
          <div>
            <label htmlFor='temperature'>Temperature</label>
            <input
              type='range'
              id='temperature'
              min='0'
              max='1'
              step='0.01'
              {...register('temperature', { valueAsNumber: true })}
            />
            {errors.temperature && (
              <span className='error-message'>
                {errors.temperature.message}
              </span>
            )}
          </div>

          <div>
            <label htmlFor='max-tokens'>Max Tokens</label>
            <input
              type='number'
              id='max-tokens'
              {...register('maxRows', { valueAsNumber: true })}
            />
            {errors.maxRows && (
              <span className='error-message'>{errors.maxRows.message}</span>
            )}
          </div>
        </section>
      </fieldset>
      <button type='submit' disabled={isPending}>
        {isPending ? 'Generating...' : 'Generate'}
      </button>
    </form>
  );
}

export default DataGenerationForm;
