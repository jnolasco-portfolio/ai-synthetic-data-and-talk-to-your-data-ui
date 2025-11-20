import { useGenerateData } from '../hooks/useGenerateData';
import { useEffect, useRef, useState } from 'react';
import { useLearnDatabase } from '../hooks/useLearnDatabase';
import type {
  LearnDatabaseRequest,
  LearnDatabaseResponse,
} from '../services/dataGenerationService';
import DataGenerationForm from './DataGenerationForm';

import DataPreview from './DataPreview';
import LoadingOverlay from './LoadingOverlay';
import type { UseFormGetValues } from 'react-hook-form';

export const DataGenerationScreen = () => {
  // State to hold the schema structure from the /learn endpoint
  const [generatedData, setGeneratedData] = useState<Record<string, string[]>>(
    {}
  );
  // State to track the secondary generation process
  const [isGenerating, setIsGenerating] = useState(false);
  // State to track the name of the table currently being generated
  const [currentTable, setCurrentTable] = useState<string | null>(null);
  // State to track the progress of the initial generation
  const [progress, setProgress] = useState(0);
  // A ref to hold the schema to avoid re-renders triggering effects
  const schemaRef = useRef<LearnDatabaseResponse | null>(null);

  // Ref to store the getValues function from react-hook-form
  const getFormValues = useRef<UseFormGetValues<LearnDatabaseRequest> | null>(
    null
  );

  // React Query hooks for our API calls
  const learnDatabase = useLearnDatabase();
  const generateData = useGenerateData();

  // This effect runs when the /learn API call is successful
  useEffect(() => {
    // Only run if we have new data from the /learn endpoint
    if (learnDatabase.data && learnDatabase.data !== schemaRef.current) {
      schemaRef.current = learnDatabase.data; // Store the new schema
      const currentSchema = learnDatabase.data;

      const generateDataForTables = async () => {
        console.log('Starting data generation for all tables...');
        setIsGenerating(true);
        const allGeneratedData: Record<string, string[]> = {};

        // Loop through each table defined in the schema
        for (const [index, table] of currentSchema.tables.entries()) {
          try {
            console.log(`Generating data for table: ${table.name}`);
            setCurrentTable(table.name); // Set the current table name for the UI
            // Call the /generate endpoint for the current table
            const response = await generateData.mutateAsync({
              conversationId: '12345', // This can be dynamic later
              tableName: table.name,
              instructions:
                getFormValues.current?.('parameters.prompt') ||
                'Generate data based on the schema.',
              maxRows: 10, // This can be from user input later
              schema: currentSchema,
            });

            // Store the results in our accumulator object
            if (response) {
              allGeneratedData[response.tableName] = response.data;
            }

            // Update progress
            const percentComplete =
              ((index + 1) / currentSchema.tables.length) * 100;
            setProgress(percentComplete);
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
        setProgress(0); // Reset progress
      };

      generateDataForTables();
    }
  }, [learnDatabase.data, generateData]);

  // This function is called when the user submits the form
  const handleGenerate = (
    request: LearnDatabaseRequest,
    getValues: UseFormGetValues<LearnDatabaseRequest>
  ) => {
    getFormValues.current = getValues; // Store the getValues function in the ref
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

  // This function is called when the user submits the refinement form
  const handleRefine = async ({
    tableName,
    instructions,
  }: {
    tableName: string;
    instructions: string;
  }) => {
    if (!schemaRef.current) return;

    console.log(`Refining data for table: ${tableName}...`);
    setIsGenerating(true); // Show loading state
    setCurrentTable(tableName);

    try {
      const response = await generateData.mutateAsync({
        conversationId: '12345', // This can be dynamic later
        tableName,
        instructions,
        maxRows: 10, // Or get this from form state
        schema: schemaRef.current,
      });

      // Update the state with the new data for the specific table
      setGeneratedData((prevData) => ({
        ...prevData,
        [response.tableName]: response.data,
      }));
    } catch (error) {
      console.error(`Error refining data for table ${tableName}:`, error);
    } finally {
      setIsGenerating(false); // Hide loading state
      setCurrentTable(null);
      // No need to reset progress here, as it's not used for single refinements
    }
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

      {isLoading && (
        <LoadingOverlay
          message={
            learnDatabase.isPending
              ? 'Learning schema...'
              : `Generating data for ${currentTable}...`
          }
          progress={progress}
        />
      )}

      <section className='datapreview'>
        {learnDatabase.error && (
          <div className='error-message'>
            Error: {learnDatabase.error.message}
          </div>
        )}

        {/* DataPreview is always visible. It will be disabled during loading
            and will show its own placeholder content until data is ready. */}
        <DataPreview
          schema={schemaRef.current}
          generatedData={generatedData}
          isDisabled={isLoading}
          onRefine={handleRefine}
        />
      </section>
    </>
  );
};
