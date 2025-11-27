import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FaArrowUp } from 'react-icons/fa';
import {
  QuestionFormDefaults,
  QuestionFormSchema,
  type QuestionFormValues,
} from '../schemas/QuestionFormSchema';

interface QuestionFormProps {
  onSubmit: (data: QuestionFormValues) => void;
}

function QuestionForm({ onSubmit }: QuestionFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<QuestionFormValues>({
    resolver: zodResolver(QuestionFormSchema),
    defaultValues: QuestionFormDefaults,
  });

  // render logic

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className='question-group'>
        <textarea
          placeholder='Ask anything'
          maxLength={1000}
          {...register('question')}
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
