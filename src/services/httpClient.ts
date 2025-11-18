import axios from 'axios';

const BASE_URL =
  'https://2c7ecc91-0331-4a18-b933-5d95ba55d77d.mock.pstmn.io/api/v1/schema-assistant';

export const httpClient = axios.create({
  baseURL: BASE_URL
});