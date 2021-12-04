import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { Row } from '../../../models/dbms';

export const rowsAdapter = createEntityAdapter<Row>();
export const rowsInitialState = rowsAdapter.getInitialState();

export const transformRows = (response: unknown): EntityState<Row> => {
  const responseRows = (response as { data: unknown }).data;
  const rows = responseRows as Row[];
  return rowsAdapter.setMany(rowsInitialState, rows);
};

export const transformRow = (response: unknown): Row => {
  const responseRow = (response as { data: unknown }).data;
  return responseRow as Row;
};
