import { EntityState } from '@reduxjs/toolkit';
import { dbmsApi } from '../index';
import { Row } from '../../../models/dbms';
import { API } from '../api_routes';
import { providesEntitiesTags } from '../../services/cache_tags_generator';
import { rowsAdapter, rowsInitialState, transformRows } from './rows_cache_helper';

export const rowsApi = dbmsApi.injectEndpoints({
  endpoints: (build) => ({
    getRows: build.query<EntityState<Row>, { databaseId: string; tableId: string }>({
      query: ({ databaseId, tableId }) => API.ROWS(databaseId, tableId),
      transformResponse: transformRows,
      providesTags: (result) => providesEntitiesTags(result, 'Row'),
    }),
    getRowsProjection: build.query<EntityState<Row>, { databaseId: string; tableId: string; columnsIds: string[] }>({
      query: ({ databaseId, tableId, columnsIds }) => ({
        url: API.ROWS_PROJECTION(databaseId, tableId),
        params: { columnsIds },
      }),
      transformResponse: transformRows,
      providesTags: (result) => providesEntitiesTags(result, 'Row'),
    }),
    deleteRow: build.mutation<
      { id: string; databaseId: string; tableId: string },
      { databaseId: string; tableId: string; rowId: string }
    >({
      query: ({ databaseId, tableId, rowId }) => ({
        url: API.ROW(databaseId, tableId, rowId),
        method: 'DELETE',
      }),
      async onQueryStarted({ databaseId, tableId, rowId }, { dispatch, queryFulfilled }) {
        const patchRowsResult = dispatch(
          rowsApi.util.updateQueryData('getRows', { databaseId, tableId }, (draftRows) => {
            rowsAdapter.removeOne(draftRows || rowsInitialState, rowId);
          })
        );
        // TODO Handle deletion from the projection cache

        try {
          await queryFulfilled;
        } catch {
          patchRowsResult.undo();
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetRowsQuery, useGetRowsProjectionQuery, useDeleteRowMutation } = rowsApi;
