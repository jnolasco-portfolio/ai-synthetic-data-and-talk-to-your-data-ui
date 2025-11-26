import { useState, useEffect } from 'react';
import type { LearnDatabaseResponse } from '../services/DataGenerationService';
import JSZip from 'jszip';
import QuickInstructionForm from './QuickInstructionForm';
import { sortTablesByDependency } from './tableSort';

interface DataPreviewProps {
  schema: LearnDatabaseResponse | null;
  generatedData: Record<string, string[]>;
  onRefine: (args: {
    tableName: string;
    instructions: string;
  }) => Promise<void>;
  isDisabled?: boolean;
}

const COLUMN_SEPARATOR = '|';

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

  const handleDownloadAll = async () => {
    if (Object.keys(generatedData).length === 0) return;

    const sortedTables = schema ? sortTablesByDependency(schema.tables) : [];
    const zip = new JSZip();
    let loadScriptContent = '';

    // Loop through sorted tables to ensure correct order for CSV and SQL script
    for (const table of sortedTables) {
      const tableName = table.name;
      const tableData = generatedData[tableName];

      // Only process tables that have generated data
      if (tableData) {
        // 1. Add CSV file to zip
        const columnNames = table.columns.map((c) => c.name);
        const csvContent = [
          columnNames.join(COLUMN_SEPARATOR),
          ...tableData,
        ].join('\n');
        zip.file(`${tableName}.csv`, csvContent);

        // 2. Append commands to the SQL load script
        loadScriptContent += `
-- Data for ${tableName}
set foreign_key_checks = 0;
TRUNCATE TABLE ${tableName};
LOAD DATA LOCAL INFILE './${tableName}.csv'
INTO TABLE ${tableName}
FIELDS TERMINATED BY '${COLUMN_SEPARATOR}'
LINES TERMINATED BY '\\n'
IGNORE 1 LINES;
set foreign_key_checks = 1;
`;
      }
    }

    // Add the generated SQL script to the zip
    zip.file('load_data.sql', loadScriptContent.trim());

    // Generate the zip file and trigger the download
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = 'synthetic-data.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        <button
          onClick={handleDownloadAll}
          disabled={isDisabled || Object.keys(generatedData).length === 0}
          className='outline'
        >
          Download All (.zip)
        </button>
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
                {row.split(COLUMN_SEPARATOR).map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell === '\\N' ? 'NULL' : cell}</td>
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
