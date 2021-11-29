import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/dist/query/react';
import { RootState } from '../store';

export const baseQueryWithApiHost: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const state = api.getState() as RootState;
  const {
    application: {
      api: { host },
    },
  } = state;
  return fetchBaseQuery({ baseUrl: host })(args, api, extraOptions);
};

export const dbmsApi = createApi({
  reducerPath: 'dbmsApi',
  baseQuery: baseQueryWithApiHost,
  tagTypes: ['Database', 'Table', 'Row'],
  endpoints: () => ({}),
});
