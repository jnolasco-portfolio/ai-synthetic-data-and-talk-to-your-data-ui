import DataGenerationForm from './DataGenerationForm';
import DataPreview from './DataPreview';

export const DataGenerationScreen = () => {
  return (
    <div className='flex flex-col gap-4'>
      <section className='p-4 rounded-xl shadow-lg bg-white border border-gray-100'>
        <DataGenerationForm />
      </section>

      <section className='p-4 rounded-xl shadow-lg bg-white border border-gray-100'>
        <DataPreview />
      </section>
    </div>
  );
};
