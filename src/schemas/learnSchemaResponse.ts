
import { z } from 'zod';

const columnSchema = z.object({
  name: z.string(),
  type: z.string(),
  nullable: z.boolean(),
  defaultValue: z.string().nullable(),
  autoIncrement: z.boolean(),
  comment: z.string(),
});

const foreignKeySchema = z.object({
  name: z.string(),
  columns: z.array(z.string()),
  referencedTable: z.string(),
  referencedColumns: z.array(z.string()),
  updateRule: z.string().nullable(),
  deleteRule: z.string().nullable(),
});

const indexSchema = z.object({
  name: z.string(),
  columns: z.array(z.string()),
  unique: z.boolean(),
  type: z.string(),
});

const tableSchema = z.object({
  name: z.string(),
  comment: z.string(),
  columns: z.array(columnSchema),
  primaryKey: z.string(),
  foreignKeys: z.array(foreignKeySchema),
  indexes: z.array(indexSchema),
});

const schemaData = z.object({
  server: z.string(),
  database: z.string(),
  tables: z.array(tableSchema),
});

export const learnSchemaResponseSchema = z.object({
  schema: schemaData,
});

export type LearnSchemaResponse = z.infer<typeof learnSchemaResponseSchema>;
