import React from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { FaArrowUp } from 'react-icons/fa';

type FormFields = {
  prompt: string;
  maxRows: number;
  instructions: string;
  file: FileList;
};

const generateDataEndpoint =
  'https://2c7ecc91-0331-4a18-b933-5d95ba55d77d.mock.pstmn.io/api/v1/schema-assistant/generate-data';

const ChatBot = () => {
  const { register, handleSubmit, reset, formState } = useForm<FormFields>();

  const onSubmit = (data: FormFields) => {
    reset();

    const formData = new FormData();
    const file = data.file[0];
    formData.append('file', file);
    formData.append('conversationId', '12345'); // Hardcoded for now
    formData.append('schemaFileName', file.name);

    const parameters = {
      prompt: data.prompt,
      maxRows: data.maxRows,
      instructions: data.instructions,
    };
    formData.append('parameters', JSON.stringify(parameters));

    axios
      .post(generateDataEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log('Response:', response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onKeyDown={onKeyDown}
      className='flex flex-col gap-2 items-end border-2 border-gray-300 p-4 rounded-3xl'
    >
      <textarea
        {...register('prompt', {
          required: true,
          validate: (value) => value.trim().length > 0,
        })}
        className='w-full border-0 focus:outline-0 resize-none'
        placeholder='Ask anything'
        maxLength={1000}
      />
      <button
        disabled={!formState.isValid}
        className='m-4 py-2 px-4 rounded-full bg-gray-950 text-gray-50 p
      -2 hover:bg-gray-700 w-9 h-9 flex items-center justify-center disabled:opacity-50'
      >
        <FaArrowUp className='shrink-0' />
      </button>
    </form>
  );
};

export default ChatBot;
