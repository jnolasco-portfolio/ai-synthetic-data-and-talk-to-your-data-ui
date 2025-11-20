import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { learnDatabaseRequestSchema } from '../schemas/learnDatabaseRequest';
import type { LearnDatabaseRequest } from '../services/dataGenerationService';

interface DataGenerationFormProps {
  onGenerate: (data: LearnDatabaseRequest) => void;
  isGenerating: boolean;
}

function DataGenerationForm({
  onGenerate,
  isGenerating,
}: DataGenerationFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LearnDatabaseRequest>({
    resolver: zodResolver(learnDatabaseRequestSchema),
    defaultValues: {
      conversationId: '1234',
      parameters: {
        maxRows: 10,
        temperature: 0.2,
      },
    },
  });

  const schemaFile = watch('schemaUpload');
  const temperatureValue = watch('parameters.temperature');

  useEffect(() => {
    if (schemaFile && schemaFile.length > 0) {
      setValue('schemaFileName', schemaFile[0].name);
    } else {
      setValue('schemaFileName', '');
    }
  }, [schemaFile, setValue]);

  const onSubmit = (data: LearnDatabaseRequest) => {
    onGenerate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor='prompt'>Prompt</label>
        <input
          type='text'
          id='prompt'
          placeholder='Enter your prompt here...'
          {...register('parameters.prompt', { disabled: isGenerating })}
        />
        {errors.parameters?.prompt && (
          <span className='error-message'>
            {errors.parameters?.prompt?.message} // TODO: Why
          </span>
        )}
      </div>
      <div className='upload-schema-group'>
        <label
          htmlFor='schema-upload'
          role='button'
          aria-disabled={isGenerating}
        >
          Upload DDL Schema
        </label>
        <input
          hidden
          type='file'
          id='schema-upload'
          accept='.sql,.txt,.ddl'
          className='sr-only'
          {...register('schemaUpload', { disabled: isGenerating })}
        />
        <input type='hidden ' {...register('schemaFileName')}></input>
        <span>
          {schemaFile && schemaFile.length > 0
            ? 'Selected file: ' + schemaFile[0].name
            : 'Supported formats: SQL.'}
          {errors.schemaUpload?.message}
        </span>
      </div>
      <div className='mb-1'></div>
      <fieldset>
        <legend>Advanced Parameters</legend>

        <section className='advanced'>
          <div>
            <label htmlFor='temperature'>
              Temperature ({temperatureValue})
            </label>
            <div className='slider-container'>
              <span>0</span>
              <input
                type='range'
                id='temperature'
                min='0'
                max='1'
                step='0.01'
                {...register('parameters.temperature', {
                  disabled: isGenerating,
                })}
              />
              <span>1</span>
            </div>
            {errors.parameters?.temperature && (
              <span className='error-message'>
                {errors.parameters?.temperature.message}
              </span>
            )}
          </div>

          <div>
            <label htmlFor='maxRows'>Max Rows</label>
            <input
              type='number'
              id='maxRows'
              {...register('parameters.maxRows', { disabled: isGenerating })}
            />
            {errors.parameters?.maxRows && (
              <span className='error-message'>
                {errors.parameters?.maxRows.message}
              </span>
            )}
          </div>
        </section>
      </fieldset>
      <button
        type='submit'
        disabled={isGenerating || !schemaFile || schemaFile.length === 0}
      >
        {isGenerating ? 'Generating...' : 'Generate'}
      </button>
      <span>{/*console.log('Current errors:', errors)*/}</span>{' '}
      {/* Debugging */}
    </form>
  );
}

export default DataGenerationForm;
