import { AnyAction, combineReducers, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { dbmsApi } from './queries';
import applicationReducer from './slices/application';
import { rtkQueryErrorLogger } from './middlewares/rtk_query_error_logger';

const reducers = combineReducers({
  application: applicationReducer,
  [dbmsApi.reducerPath]: dbmsApi.reducer,
});

export const store = configureStore({
  reducer: reducers,
  devTools: true,
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), dbmsApi.middleware, rtkQueryErrorLogger],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, AnyAction>;

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback
// as the 2nd arg for customization
// setupListeners(store.dispatch)
