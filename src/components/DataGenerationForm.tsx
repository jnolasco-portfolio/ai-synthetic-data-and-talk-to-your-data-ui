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
      <div className='mb-3'>
        <label
          htmlFor='prompt'
          className='block text-gray-700 font-medium mb-1'
        >
          Prompt
        </label>
        <input
          type='text'
          id='prompt'
          placeholder='Enter your prompt here...'
          {...register('prompt')}
          className='w-full'
        />
        {errors.prompt && (
          <span className='error-message'>{errors.prompt.message}</span>
        )}
      </div>

      <div className='mb-6'>
        <label
          htmlFor='schema-upload'
          className='px-4 py-2 bg-gray-800 text-white font-normal rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-400'
        >
          Upload DDL Schema
        </label>
        <input
          type='file'
          id='schema-upload'
          accept='.sql,.txt,.ddl'
          className='sr-only'
          {...register('schemaUpload')}
        />

        <span className='text-gray-500 text-sm px-2'>
          Supported formats: SQL.
        </span>
        <span className='text-gray-500 text-sm px-2'>
          {schemaFile && schemaFile.length > 0
            ? schemaFile[0].name
            : 'No file selected'}
        </span>
      </div>

      <hr className='mb-2' />

      <fieldset className='flex gap-4'>
        <legend className='mb-2'>Advanced Parameters</legend>

        <div className='flex-1'>
          <label
            htmlFor='temperature'
            className='block text-gray-700 font-medium mb-1'
          >
            Temperature
          </label>
          <input
            className='w-full'
            type='range'
            id='temperature'
            min='0'
            max='1'
            step='0.01'
            {...register('temperature', { valueAsNumber: true })}
          />
          {errors.temperature && (
            <span className='error-message'>{errors.temperature.message}</span>
          )}
        </div>

        <div className='flex-1'>
          <label
            htmlFor='max-tokens'
            className='block text-gray-700 font-medium mb-1'
          >
            Max Tokens
          </label>
          <input
            type='number'
            id='max-tokens'
            {...register('maxRows', { valueAsNumber: true })}
            className='w-full'
          />
          {errors.maxRows && (
            <span className='error-message'>{errors.maxRows.message}</span>
          )}
        </div>
      </fieldset>
      <button
        type='submit'
        className='px-4 py-2 bg-gray-800 text-white font-normal rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-400'
        disabled={isPending}
      >
        {isPending ? 'Generating...' : 'Generate'}
      </button>
    </form>
  );
}

export default DataGenerationForm;
