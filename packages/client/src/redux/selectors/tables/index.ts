import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { tablesAdapter, tablesInitialState } from '../../queries/tables/tables_cache_helper';
import { tablesApi } from '../../queries/tables';
import { selectActiveDatabaseId, selectActiveTableId } from '../application';
import { stateSelector, undefinedResultSelector } from '../utils';
import { TableColumnsIndex } from '../../../models/dbms';

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

export const selectActiveTable = createSelector(stateSelector, selectActiveTableId, (getState, activeTableId) =>
  !activeTableId ? undefined : selectTableById(getState(), activeTableId)
);

export const sortColumnsIndex = (columnsIndex: TableColumnsIndex): string[] =>
  Object.values(columnsIndex)
    .sort(
      ({ orderIndex: columnOrderIndexA }, { orderIndex: columnOrderIndexB }) => columnOrderIndexA - columnOrderIndexB
    )
    .map((column) => column.id);

export const selectActiveTableColumnsOrderIndex = createSelector(selectActiveTable, (activeTable) =>
  !activeTable ? undefined : sortColumnsIndex(activeTable.columnsIndex)
);
