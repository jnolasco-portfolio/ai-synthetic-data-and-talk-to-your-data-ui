import type { Table } from '../schemas/learnDatabaseResponse';

/**
 * Sorts tables based on foreign key dependencies to ensure parent tables are processed before child tables.
 * This is a topological sort implementation.
 * @param tables - The array of tables from the schema.
 * @returns A new array of tables in the correct processing order.
 */
export const sortTablesByDependency = (tables: Table[]): Table[] => {
  const inDegree: Record<string, number> = {};
  const adjList: Record<string, string[]> = {};
  const tableMap: Record<string, Table> = {};

  // Initialize graph data structures
  for (const table of tables) {
    inDegree[table.name] = 0;
    adjList[table.name] = [];
    tableMap[table.name] = table;
  }

  // Build the graph and in-degree map
  for (const table of tables) {
    for (const fk of table.foreignKeys) {
      // `fk.referencesTable` is the parent, `table.name` is the child.
      // The edge goes from parent to child.
      if (adjList[fk.referencesTable]) {
        adjList[fk.referencesTable].push(table.name);
        inDegree[table.name]++;
      }
    }
  }

  // Initialize the queue with nodes that have no incoming edges (no dependencies)
  const queue = tables.filter((table) => inDegree[table.name] === 0);
  const sorted: Table[] = [];

  while (queue.length > 0) {
    const currentTable = queue.shift()!;
    sorted.push(currentTable);

    // For each child table, decrement its in-degree
    for (const childTableName of adjList[currentTable.name]) {
      inDegree[childTableName]--;
      if (inDegree[childTableName] === 0) {
        queue.push(tableMap[childTableName]);
      }
    }
  }

  return sorted.length === tables.length ? sorted : tables; // Fallback to original if cycle detected
};