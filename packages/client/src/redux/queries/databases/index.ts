import { EntityState } from '@reduxjs/toolkit';
import { dbmsApi } from '../index';
import { Database } from '../../../models/dbms';
import { CreateDatabaseDto, UpdateDatabaseDto } from '../../../dtos';
import { API } from '../api_routes';
import {
  databasesAdapter,
  databasesInitialState,
  transformDatabase,
  transformDatabases,
} from './databases_cache_helper';

export const databasesApi = dbmsApi.injectEndpoints({
  endpoints: (build) => ({
    getDatabases: build.query<EntityState<Database>, void>({
      query: () => API.DATABASES,
      transformResponse: transformDatabases,
    }),
    getDatabase: build.query<Database, { databaseId: string }>({
      query: ({ databaseId }) => API.DATABASE(databaseId),
      transformResponse: transformDatabase,
      async onQueryStarted({ databaseId }, { dispatch, queryFulfilled }) {
        const { data: database } = await queryFulfilled;
        dispatch(
          databasesApi.util.updateQueryData('getDatabases', undefined, (draftDatabases) => {
            databasesAdapter.upsertOne(draftDatabases || databasesInitialState, database);
          })
        );
      },
    }),
    addDatabase: build.mutation<Database, { database: CreateDatabaseDto }>({
      query: ({ database }) => ({
        url: API.DATABASES,
        method: 'POST',
        body: database,
      }),
      transformResponse: transformDatabase,
      async onQueryStarted({ database }, { dispatch, queryFulfilled }) {
        const { data: newDatabase } = await queryFulfilled;
        dispatch(
          databasesApi.util.updateQueryData('getDatabases', undefined, (draftDatabases) => {
            databasesAdapter.addOne(draftDatabases || databasesInitialState, newDatabase);
          })
        );
      },
    }),
    updateDatabase: build.mutation<Database, { databaseId: string; database: UpdateDatabaseDto }>({
      query: ({ databaseId, database }) => ({
        url: API.DATABASE(databaseId),
        method: 'PUT',
        body: database,
      }),
      transformResponse: transformDatabase,
      async onQueryStarted({ databaseId, database }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          databasesApi.util.updateQueryData('getDatabases', undefined, (draftDatabases) => {
            databasesAdapter.updateOne(draftDatabases || databasesInitialState, { id: databaseId, changes: database });
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
    deleteDatabase: build.mutation<{ id: string }, { databaseId: string }>({
      query({ databaseId }) {
        return {
          url: API.DATABASE(databaseId),
          method: 'DELETE',
        };
      },
      async onQueryStarted({ databaseId }, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(
          databasesApi.util.updateQueryData('getDatabases', undefined, (draftDatabases) => {
            databasesAdapter.removeOne(draftDatabases || databasesInitialState, databaseId);
          })
        );
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDatabasesQuery,
  useGetDatabaseQuery,
  useAddDatabaseMutation,
  useUpdateDatabaseMutation,
  useDeleteDatabaseMutation,
} = databasesApi;
