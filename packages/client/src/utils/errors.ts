import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query/react';
import { SerializedError } from '@reduxjs/toolkit';

export const toFetchError = (
  originalError?: FetchBaseQueryError | SerializedError
): { message: string; status: string } => {
  if (!originalError) return { message: 'Unknown error', status: 'Unknown' };
  const {
    data: { message },
    status,
  } = originalError as { data: { message: string }; status: string };
  return { message, status };
};
