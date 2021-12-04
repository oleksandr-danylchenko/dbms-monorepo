import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { tablesAdapter, tablesInitialState } from '../../queries/tables/tables_cache_helper';
import { tablesApi } from '../../queries/tables';
import { selectActiveDatabaseId } from '../application';
import { undefinedResultSelector } from '../utils';

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

export const selectNameSortedTables = createSelector(selectAllTables, (tables) =>
  tables.sort(({ name: tableNameA }, { name: tableNameB }) => tableNameA.localeCompare(tableNameB))
);
