import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FaArrowUp } from 'react-icons/fa';
import {
  QuestionRequestDefaults,
  QuestionRequestSchema,
  type QuestionRequest,
} from '../schemas/QuestionRequestSchema';

interface QuestionFormProps {
  onSubmit: (data: QuestionRequest) => void;
}

function QuestionForm({ onSubmit }: QuestionFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    reset, // Get the reset function
    formState: { errors, isSubmitting },
  } = useForm<QuestionRequest>({
    resolver: zodResolver(QuestionRequestSchema),
    defaultValues: QuestionRequestDefaults,
  });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent new line
      if (!isSubmitting && watch('question').length > 0) {
        handleSubmit(submitAndReset)(); // Submit the form
      }
    }
  };

  const submitAndReset = (data: QuestionRequest) => {
    onSubmit(data);
    reset(); // Reset the form after submission
  };

  return (
    <form onSubmit={handleSubmit(submitAndReset)}> {/* Use the new submit handler */}
      <div className='question-group'>
        <textarea
          placeholder='Ask anything'
          maxLength={1000}
          {...register('question')}
          onKeyDown={handleKeyDown} // Add the key down handler
        ></textarea>
        {errors.question && <span>{errors.question.message}</span>}
        <button
          type='submit'
          disabled={isSubmitting || watch('question').length === 0}
        >
          <FaArrowUp className='shrink-0' />
        </button>

        {/* Hidden fields */}

        <input hidden {...register('conversationId')} />
        <input hidden {...register('schemaName')} />
      </div>
    </form>
  );
}

export default QuestionForm;
