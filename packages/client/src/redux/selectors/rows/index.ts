import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { tablesAdapter, tablesInitialState } from '../../queries/tables/tables_cache_helper';
import { tablesApi } from '../../queries/tables';
import { selectActiveDatabaseId, selectActiveTableId } from '../application';
import { stateSelector, undefinedResultSelector } from '../utils';
import { rowsApi } from '../../queries/rows';
import { rowsAdapter, rowsInitialState } from '../../queries/rows/rows_cache_helper';

const selectRowsResult = createSelector(selectActiveDatabaseId, selectActiveTableId, (databaseId, tableId) =>
  !databaseId || !tableId ? undefinedResultSelector : rowsApi.endpoints.getRows.select({ databaseId, tableId })
);

const selectRowsData = createSelector(
  (state: RootState) => selectRowsResult(state)(state),
  (rowsResults) => rowsResults.data
);

export const {
  selectAll: selectAllRows,
  selectById: selectRowById,
  selectIds: selectRowsIds,
} = rowsAdapter.getSelectors((state: RootState) => selectRowsData(state) || rowsInitialState);
