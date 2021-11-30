import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { Table } from '../../../models/dbms';

export const tablesAdapter = createEntityAdapter<Table>({
  sortComparer: ({ name: tableName1 }, { name: tableName2 }) => tableName1.localeCompare(tableName2),
});
export const tablesInitialState = tablesAdapter.getInitialState();

export const transformTables = (response: unknown): EntityState<Table> => {
  const responseTables = (response as { data: unknown }).data;
  const tables = responseTables as Table[];
  return tablesAdapter.setMany(tablesInitialState, tables);
};

export const transformTable = (response: unknown): Table => {
  const responseTable = (response as { data: unknown }).data;
  return responseTable as Table;
};
