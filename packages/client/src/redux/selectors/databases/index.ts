import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { databasesApi } from '../../queries/databases';
import { databasesAdapter, databasesInitialState } from '../../queries/databases/databases_cache_helper';

const selectDatabasesResult = databasesApi.endpoints.getDatabases.select();

const selectDatabasesData = createSelector(
  (state: RootState) => selectDatabasesResult(state),
  (databasesResult) => databasesResult.data
);

export const {
  selectAll: selectAllDatabases,
  selectById: selectDatabaseById,
  selectIds: selectDatabasesIds,
} = databasesAdapter.getSelectors((state: RootState) => selectDatabasesData(state) || databasesInitialState);
