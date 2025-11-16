import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  learnDatabaseRequestSchema,
  type LearnDatabaseRequest,
} from '../schemas/learnDatabaseRequest';
import { useLearnDatabase } from '../hooks/useLearnDatabase';

function DataGenerationForm() {
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
  const { mutate, isPending } = useLearnDatabase();

  useEffect(() => {
    if (schemaFile && schemaFile.length > 0) {
      setValue('schemaFileName', schemaFile[0].name);
    } else {
      setValue('schemaFileName', '');
    }
  }, [schemaFile, setValue]);

  // TODO: STILL best submit button or onClick event?
  const onSubmit = (data: LearnDatabaseRequest) => {
    console.log('onSubmit', data);
    const formData = new FormData();
    formData.append('conversationId', data.conversationId);
    formData.append('prompt', data.parameters.prompt);
    formData.append('temperature', data.parameters.temperature.toString());
    formData.append('maxRows', data.parameters.maxRows.toString());

    // TODO: STILL necessary?
    if (data.schemaUpload && data.schemaUpload.length > 0) {
      const file = data.schemaUpload[0];
      formData.append('schemaUpload', file);
      formData.append('schemaFileName', file.name);
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
          {...register('parameters.prompt')}
        />
        {errors.parameters?.prompt && (
          <span className='error-message'>
            {errors.parameters?.prompt?.message} // TODO: Why
          </span>
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
            <label htmlFor='temperature'>Temperature</label>
            <input
              type='range'
              id='temperature'
              min='0'
              max='1'
              step='0.01'
              {...register('parameters.temperature')}
            />
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
              {...register('parameters.maxRows')}
            />
            {errors.parameters?.maxRows && (
              <span className='error-message'>
                {errors.parameters?.maxRows.message}
              </span>
            )}
          </div>
        </section>
      </fieldset>
      <button type='submit' disabled={isPending}>
        {isPending ? 'Generating...' : 'Generate'}
      </button>
      <span>{console.log('Current errors:', errors)}</span> {/* Debugging */}
    </form>
  );
}

export default DataGenerationForm;
