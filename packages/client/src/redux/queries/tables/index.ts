import { EntityState } from '@reduxjs/toolkit';
import { dbmsApi } from '../index';
import { Table } from '../../../models/dbms';
import { CreateTableDto, UpdateTableDto } from '../../../dtos';
import { API } from '../api_routes';
import { tablesAdapter, tablesInitialState, transformTable, transformTables } from './tables_cache_helper';

export const tablesApi = dbmsApi.injectEndpoints({
  endpoints: (build) => ({
    getTables: build.query<EntityState<Table>, { databaseId: string }>({
      query: ({ databaseId }) => API.TABLES(databaseId),
      transformResponse: transformTables,
    }),
    getTable: build.query<Table, { databaseId: string; tableId: string }>({
      query: ({ databaseId, tableId }) => API.TABLE(databaseId, tableId),
      transformResponse: transformTable,
      async onQueryStarted({ databaseId }, { dispatch, queryFulfilled }) {
        const { data: table } = await queryFulfilled;
        dispatch(
          tablesApi.util.updateQueryData('getTables', { databaseId }, (draftTables) => {
            tablesAdapter.upsertOne(draftTables || tablesInitialState, table);
          })
        );
      },
    }),
    addTable: build.mutation<Table, { databaseId: string; table: CreateTableDto }>({
      query: ({ databaseId, table }) => ({
        url: API.TABLES(databaseId),
        method: 'POST',
        body: table,
      }),
      transformResponse: transformTable,
      async onQueryStarted({ databaseId }, { dispatch, queryFulfilled }) {
        const { data: newTable } = await queryFulfilled;
        dispatch(
          tablesApi.util.updateQueryData('getTables', { databaseId }, (draftTables) => {
            tablesAdapter.addOne(draftTables || tablesInitialState, newTable);
          })
        );
      },
    }),
    updateTable: build.mutation<Table, { databaseId: string; tableId: string; table: UpdateTableDto }>({
      query: ({ databaseId, tableId, table }) => ({
        url: API.TABLE(databaseId, tableId),
        method: 'PUT',
        body: table,
      }),
      transformResponse: transformTable,
      async onQueryStarted({ databaseId, tableId, table }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          tablesApi.util.updateQueryData('getTables', { databaseId }, (draftTables) => {
            tablesAdapter.updateOne(draftTables || tablesInitialState, { id: tableId, changes: table });
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    deleteTable: build.mutation<{ id: string; databaseId: string }, { databaseId: string; tableId: string }>({
      query({ databaseId, tableId }) {
        return {
          url: API.TABLE(databaseId, tableId),
          method: 'DELETE',
        };
      },
      async onQueryStarted({ databaseId, tableId }, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(
          tablesApi.util.updateQueryData('getTables', { databaseId }, (draftTables) => {
            tablesAdapter.removeOne(draftTables || tablesInitialState, tableId);
          })
        );
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTablesQuery,
  useGetTableQuery,
  useAddTableMutation,
  useUpdateTableMutation,
  useDeleteTableMutation,
} = tablesApi;
