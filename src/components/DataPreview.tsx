import { useState, useEffect } from 'react';
import type { LearnDatabaseResponse } from '../services/dataGenerationService';
import QuickInstructionForm from './QuickInstructionForm';

interface DataPreviewProps {
  schema: LearnDatabaseResponse | null;
  generatedData: Record<string, string[]>;
  onRefine: (args: {
    tableName: string;
    instructions: string;
  }) => Promise<void>;
  isDisabled?: boolean;
}

const DataPreview = ({
  schema,
  generatedData,
  isDisabled = false,
  onRefine,
}: DataPreviewProps) => {
  // State to keep track of the currently selected table name
  const [selectedTable, setSelectedTable] = useState<string>('');

  // When the schema from the API changes, default to selecting the first table
  useEffect(() => {
    if (schema?.tables && schema.tables.length > 0) {
      setSelectedTable(schema.tables[0].name);
    }
  }, [schema]);

  // Find the full table object based on the selected name
  const tableToDisplay = schema?.tables.find((t) => t.name === selectedTable);
  const dataToDisplay = generatedData[selectedTable] || [];

  const containerClasses = isDisabled ? 'disabled' : '';

  return (
    <section aria-disabled={isDisabled} className={containerClasses}>
      <div className='preview-selector-group'>
        <label htmlFor='table-select' className='block'>
          Data Preview
        </label>
        <select
          name='table'
          id='table-select'
          className='flex-1'
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
          disabled={isDisabled || !schema?.tables.length}
        >
          <option value=''>Select a table...</option>
          {schema?.tables.map((table) => (
            <option key={table.name} value={table.name}>
              {table.name}
            </option>
          ))}
        </select>
      </div>

      <QuickInstructionForm
        isDisabled={isDisabled || !selectedTable}
        onSubmit={(instructions) =>
          onRefine({ tableName: selectedTable, instructions })
        }
      />

      {!schema && !isDisabled && (
        <p>Upload a schema and generate data to see the preview.</p>
      )}
      {/* If a table is found, display its columns and data */}
      {tableToDisplay && dataToDisplay.length > 0 && (
        <table>
          <thead>
            <tr>
              {tableToDisplay.columns.map((column) => (
                <th scope='col' key={column.name}>
                  {column.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataToDisplay.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.split(',').map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {tableToDisplay && dataToDisplay.length === 0 && !isDisabled && (
        <p>
          Data for table "{tableToDisplay.name}" has not been generated yet.
        </p>
      )}
    </section>
  );
};

export default DataPreview;
