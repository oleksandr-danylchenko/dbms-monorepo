import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { Database } from '../../../models/dbms';

export const databasesAdapter = createEntityAdapter<Database>({
  sortComparer: ({ name: dbName1 }, { name: dbName2 }) => dbName1.localeCompare(dbName2),
});
export const databasesInitialState = databasesAdapter.getInitialState();

export const transformDatabases = (response: unknown): EntityState<Database> => {
  const responseDatabases = (response as { data: unknown }).data;
  const databases = responseDatabases as Database[];
  return databasesAdapter.setMany(databasesInitialState, databases);
};

export const transformDatabase = (response: unknown): Database => {
  const responseDatabase = (response as { data: unknown }).data;
  return responseDatabase as Database;
};
