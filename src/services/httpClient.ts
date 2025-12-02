import axios from 'axios';

// const BASE_URL = 'https://2c7ecc91-0331-4a18-b933-5d95ba55d77d.mock.pstmn.io/api/v1/schema-assistant';

const SCHEMA_ASSISTANT_BASE_URL =
  'http://localhost:8081/api/v1/schema-assistant';

const DATA_CONVERSATIONS_BASE_URL =
  'http://localhost:8081/api/v1/data-conversations';

export const schemaAssistantHttpClient = axios.create({
  baseURL: SCHEMA_ASSISTANT_BASE_URL
});

export const talkToYourDataHttpClient = axios.create({
  baseURL: DATA_CONVERSATIONS_BASE_URL
});