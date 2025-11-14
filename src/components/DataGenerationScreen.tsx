import DataGenerationForm from './DataGenerationForm';
import DataPreview from './DataPreview';

export const DataGenerationScreen = () => {
  return (
    <>
      <section>
        <DataGenerationForm />
      </section>

      <hr />

      <section className='datapreview'>
        <DataPreview />
      </section>
    </>
  );
};
