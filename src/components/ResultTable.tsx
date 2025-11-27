interface ResultTableProps {
  /** Array of records where each record maps column name → string value */
  result: Record<string, string>[];
}

/**
 * Dynamically renders a table styled with Pico CSS.
 */
export default function ResultTable({ result }: ResultTableProps) {
  // 1️⃣ Determine column order from the first row (if any)
  const columns = result.length > 0 ? Object.keys(result[0]) : [];

  return (
    // Pico container gives some padding and max‑width
    <table className='striped'>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col}>{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {result.map((row, rowIdx) => (
          <tr key={rowIdx}>
            {columns.map((col) => (
              <td key={col}>{row[col] ?? ''}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
