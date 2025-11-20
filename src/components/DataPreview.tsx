import { useState, useEffect } from 'react';
import type { LearnDatabaseResponse } from '../services/dataGenerationService';

interface DataPreviewProps {
  schema: LearnDatabaseResponse;
  generatedData: Record<string, string[]>;
}

const DataPreview = ({ schema, generatedData }: DataPreviewProps) => {
  // State to keep track of the currently selected table name
  const [selectedTable, setSelectedTable] = useState<string>('');

  // When the schema from the API changes, default to selecting the first table
  useEffect(() => {
    if (schema && schema.tables.length > 0) {
      setSelectedTable(schema.tables[0].name);
    }
  }, [schema]);

  // Find the full table object based on the selected name
  const tableToDisplay = schema.tables.find((t) => t.name === selectedTable);
  const dataToDisplay = generatedData[selectedTable] || [];

  if (!schema) {
    return <div>No schema available to display.</div>;
  }

  return (
    <section>
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
        >
          {schema.tables.map((table) => (
            <option key={table.name} value={table.name}>
              {table.name}
            </option>
          ))}
        </select>
      </div>

      {/* If a table is found, display its columns and data */}
      {tableToDisplay && (
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
    </section>
  );
};

export default DataPreview;
