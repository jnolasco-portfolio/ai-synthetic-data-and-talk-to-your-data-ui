import { useState } from 'react';

interface QuickInstructionFormProps {
  /**
   * A function to call when the form is submitted with valid instructions.
   * @param instructions The text entered by the user.
   * @returns A promise that resolves when the submission is handled.
   */
  onSubmit: (instructions: string) => Promise<void>;
  /**
   * Whether the form should be disabled.
   */
  isDisabled?: boolean;
}

const QuickInstructionForm = ({
  onSubmit,
  isDisabled = false,
}: QuickInstructionFormProps) => {
  const [instructions, setInstructions] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!instructions.trim()) return; // Don't submit if empty

    await onSubmit(instructions);
    setInstructions(''); // Clear input after successful submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        placeholder='Enter quick instructions to refine data...'
        disabled={isDisabled}
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
      />
      <button type='submit' disabled={isDisabled || !instructions.trim()}>
        Refine
      </button>
    </form>
  );
};

export default QuickInstructionForm;
