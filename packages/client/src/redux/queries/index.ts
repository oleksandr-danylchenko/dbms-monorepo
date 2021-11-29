import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { API_HOST } from '../../constants';

export const dbmsApi = createApi({
  reducerPath: 'todoBoardApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_HOST, // TODO Replace with the Redux value selection
  }),
  endpoints: () => ({}),
});
