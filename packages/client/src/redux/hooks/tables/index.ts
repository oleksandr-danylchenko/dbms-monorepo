import { skipToken } from '@reduxjs/toolkit/query';
import { useGetTablesQuery } from '../../queries/tables';
import { useActiveDatabase } from '../databases';

export const useActiveDatabaseTables = () => {
  const { data: activeDatabase, isFetching: isActiveDatabaseFetching } = useActiveDatabase();
  const isActiveDatabaseReady = activeDatabase && !isActiveDatabaseFetching;

  return useGetTablesQuery(isActiveDatabaseReady ? { databaseId: activeDatabase.id } : skipToken);
};
