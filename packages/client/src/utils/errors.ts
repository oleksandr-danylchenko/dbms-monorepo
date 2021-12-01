import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query/react';
import { SerializedError } from '@reduxjs/toolkit';

export const toFetchError = (
  originalError: FetchBaseQueryError | SerializedError
): { message: string; status: string } => {
  const { error, status } = originalError as { error: string; status: string };
  return { message: error, status };
};
