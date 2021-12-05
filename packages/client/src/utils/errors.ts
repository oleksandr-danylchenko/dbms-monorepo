import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query/react';
import { SerializedError } from '@reduxjs/toolkit';

export interface FetchError {
  message: string;
  status: string;
}

export const toFetchError = (originalError?: FetchBaseQueryError | SerializedError): FetchError | undefined => {
  if (!originalError) return undefined;
  const {
    data: { message },
    status,
  } = originalError as { data: { message: string }; status: string };
  return { message, status };
};

export const toMandatoryFetchError = (originalError?: FetchBaseQueryError | SerializedError): FetchError => {
  if (!originalError) return { message: 'Unknown error', status: 'Unknown' };
  return toFetchError(originalError) as FetchError;
};
