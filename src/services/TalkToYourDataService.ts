import type { QuestionRequest } from '../schemas/QuestionRequestSchema';
import type { QuestionResponse } from '../schemas/QuestionResponseSchema';
import { talkToYourDataHttpClient } from './httpClient';


const COLUMN_SEPARATOR = '|';
const NULL_REPRESENTATION = '\\N';

/**
 * Parses a raw string result into an array of objects.
 * Assumes the first line is a header row.
 * @param rawResult The raw string from the API.
 * @returns An array of objects, or an empty array if the input is invalid.
 */
const parseResult = (rawResult: any): Record<string, string | null>[] => {
  if (typeof rawResult !== 'string' || !rawResult.trim()) {
    return [];
  }

  const lines = rawResult.trim().split('\n');
  if (lines.length < 2) {
    // Header only or empty, no data
    return [];
  }

  const headers = lines[0].split(COLUMN_SEPARATOR).map((h) => h.trim());
  const dataRows = lines.slice(1);

  return dataRows.map((row) => {
    const values = row.split(COLUMN_SEPARATOR);
    const record: Record<string, string | null> = {};
    headers.forEach((header, index) => {
      const value = values[index]?.trim();
      record[header] = value === NULL_REPRESENTATION ? null : value;
    });
    return record;
  });
};

const parseHtmlResult = (html: string): Record<string, string>[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const table = doc.querySelector('table');
  if (!table) return [];

  const headers = Array.from(table.querySelectorAll('thead th')).map(
    (th) => th.textContent || ''
  );
  const rows = Array.from(table.querySelectorAll('tbody tr'));

  return rows.map((row) => {
    const cells = Array.from(row.querySelectorAll('td'));
    const rowData: Record<string, string> = {};
    headers.forEach((header, index) => {
      rowData[header] = cells[index]?.textContent || '';
    });
    return rowData;
  });
};

export const askQuestion = async (
  request: QuestionRequest
): Promise<QuestionResponse> => {
  const { data } = await talkToYourDataHttpClient.post('/questions', request);

  // Check if the response is a string (HTML) or an object (JSON)
  if (typeof data === 'string') {
    const result = parseHtmlResult(data);
    // Fabricate a QuestionResponse object
    return {
      id: new Date().toISOString(), // Or generate a UUID
      conversationId: request.conversationId,
      question: request.question,
      sqlQuery: '', // Not available in the HTML response
      result: result,
      metadata: {
        content_type: 'table',
        category_key: '',
        value_key: '',
      },
    } as QuestionResponse;
  }

  // If it's JSON, it might have a raw string in the 'result' field
  if (typeof data.result === 'string') {
    const parsedResult = parseResult(data.result);
    return {
      ...data,
      result: parsedResult,
    };
  }

  // Otherwise, assume it's already in the correct QuestionResponse format
  return data as QuestionResponse;
};
