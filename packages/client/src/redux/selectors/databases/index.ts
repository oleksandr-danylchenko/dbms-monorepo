import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { databasesApi } from '../../queries/databases';
import { databasesAdapter, databasesInitialState } from '../../queries/databases/databases_cache_helper';
import { stateSelector } from '../utils';
import { selectActiveDatabaseId } from '../application';

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

export const selectNameSortedDatabases = createSelector(selectAllDatabases, (databases) =>
  databases.sort(({ name: dbNameA }, { name: dbNameB }) => dbNameA.localeCompare(dbNameB))
);
// // Can be not used. Just valuable as an example of usage of the selector inside the selector
// export const selectActiveDatabase = createSelector(
//   stateSelector,
//   selectActiveDatabaseId,
//   (getState, activeDatabaseId) => (!activeDatabaseId ? undefined : selectDatabaseById(getState(), activeDatabaseId))
// );
