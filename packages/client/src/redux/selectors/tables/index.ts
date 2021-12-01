import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { tablesAdapter, tablesInitialState } from '../../queries/tables/tables_cache_helper';
import { tablesApi } from '../../queries/tables';
import { selectActiveDatabaseId, selectActiveTableId } from '../application';
import { stateSelector, undefinedResultSelector } from '../utils';

const selectTablesResult = createSelector(selectActiveDatabaseId, (databaseId) =>
  !databaseId ? undefinedResultSelector : tablesApi.endpoints.getTables.select({ databaseId })
);

const selectTablesData = createSelector(
  (state: RootState) => selectTablesResult(state)(state),
  (tablesResults) => tablesResults.data
);

export const {
  selectAll: selectAllTables,
  selectById: selectTableById,
  selectIds: selectTablesIds,
} = tablesAdapter.getSelectors((state: RootState) => selectTablesData(state) || tablesInitialState);
