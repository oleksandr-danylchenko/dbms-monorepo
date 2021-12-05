import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query/react';
import { SerializedError } from '@reduxjs/toolkit';

export interface FetchError {
  message: string;
  status: string;
}

export const toFetchError = (originalError?: FetchBaseQueryError | SerializedError): FetchError | undefined => {
  if (!originalError) return undefined;

  const { data, error, status } = originalError as { data: { message: string }; error: string; status: string };
  const message = data?.message || error;
  return { message, status };
};

export const toMandatoryFetchError = (originalError?: FetchBaseQueryError | SerializedError): FetchError => {
  if (!originalError) return { message: 'Unknown error', status: 'Unknown' };
  return toFetchError(originalError) as FetchError;
};
