import { isRejectedWithValue, Middleware, MiddlewareAPI } from '@reduxjs/toolkit';
import log from 'loglevel';

export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const { type, payload, meta } = action;
    log.error('We got a rejected action!', {
      type,
      error: payload?.error,
      status: payload?.status,
      originalStatus: payload?.originalStatus,
      args: meta?.arg,
      request: meta?.baseQueryMeta?.request,
      endpointMessage: payload?.data?.message,
    });
  }
  return next(action);
};
