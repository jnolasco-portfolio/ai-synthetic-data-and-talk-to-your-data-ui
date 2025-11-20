import { useEffect, useState } from 'react';
import { useLearnDatabase } from '../hooks/useLearnDatabase';
import { useGenerateData } from '../hooks/useGenerateData';
import type {
  LearnDatabaseRequest,
  LearnDatabaseResponse,
} from '../services/dataGenerationService';
import DataGenerationForm from './DataGenerationForm';
import DataPreview from './DataPreview';

export const DataGenerationScreen = () => {
  // State to hold the schema structure from the /learn endpoint
  const [schema, setSchema] = useState<LearnDatabaseResponse | null>(null);
  // State to hold the generated data from the /generate endpoint
  const [generatedData, setGeneratedData] = useState<Record<string, string[]>>(
    {}
  );
  // State to track the secondary generation process
  const [isGenerating, setIsGenerating] = useState(false);
  // State to track the name of the table currently being generated
  const [currentTable, setCurrentTable] = useState<string | null>(null);

  // React Query hooks for our API calls
  const learnDatabase = useLearnDatabase();
  const generateData = useGenerateData();

  // This effect runs when the /learn API call is successful
  useEffect(() => {
    if (learnDatabase.data) {
      console.log('Schema learned successfully. Preparing to generate data...');
      setSchema(learnDatabase.data);
    }
  }, [learnDatabase.data]);

  // This effect runs when the `schema` state is updated
  useEffect(() => {
    if (schema) {
      const generateDataForTables = async () => {
        console.log('Starting data generation for all tables...');
        setIsGenerating(true);
        const allGeneratedData: Record<string, string[]> = {};

        // Loop through each table defined in the schema
        for (const table of schema.tables) {
          try {
            console.log(`Generating data for table: ${table.name}`);
            setCurrentTable(table.name); // Set the current table name for the UI
            // Call the /generate endpoint for the current table
            const response = await generateData.mutateAsync({
              conversationId: '12345', // This can be dynamic later
              tableName: table.name,
              instructions: 'Generate data based on the schema.', // This can be from user input later
              maxRows: 10, // This can be from user input later
              schema: schema,
            });

            // Store the results in our accumulator object
            if (response) {
              allGeneratedData[response.tableName] = response.data;
            }
          } catch (error) {
            console.error(
              `Error generating data for table ${table.name}:`,
              error
            );
          }
        }

        console.log('All data generation complete.');
        setGeneratedData(allGeneratedData);
        setIsGenerating(false);
        setCurrentTable(null); // Reset after completion
      };

      generateDataForTables();
    }
  }, [schema]); // Dependency: this effect runs when `schema` changes

  // This function is called when the user submits the form
  const handleGenerate = (request: LearnDatabaseRequest) => {
    console.log('Initiating schema learning...');
    const formData = new FormData();
    formData.append('conversationId', request.conversationId);

    // Bundle parameters into a single JSON string as per the API contract
    formData.append('parameters', JSON.stringify(request.parameters));

    if (request.schemaUpload && request.schemaUpload.length > 0) {
      const file = request.schemaUpload[0];
      // The backend expects the file to be named 'file'
      formData.append('file', file);
      formData.append('schemaFileName', file.name);
    }

    learnDatabase.mutate(formData);
  };

  // Combine loading states for the UI
  const isLoading = learnDatabase.isPending || isGenerating;

  return (
    <>
      <section>
        <DataGenerationForm
          onGenerate={handleGenerate}
          isGenerating={learnDatabase.isPending || isGenerating}
        />
      </section>

      <hr />

      <section className='datapreview'>
        {/* Show a generic loading message during schema learning */}
        {learnDatabase.isPending && (
          <span aria-busy='true'>Learning schema...</span>
        )}

        {/* Show a specific message during data generation for each table */}
        {isGenerating && currentTable && (
          <span aria-busy='true'>Generating data for {currentTable}...</span>
        )}

        {learnDatabase.error && (
          <div className='error-message'>
            Error: {learnDatabase.error.message}
          </div>
        )}

        {/* DataPreview is always visible. It will be disabled during loading
            and will show its own placeholder content until data is ready. */}
        <DataPreview
          schema={schema}
          generatedData={generatedData}
          isDisabled={isLoading}
        />
      </section>
    </>
  );
};
