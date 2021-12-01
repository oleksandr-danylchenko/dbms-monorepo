import { skipToken } from '@reduxjs/toolkit/query';
import { useGetTablesQuery } from '../../queries/tables';
import { useActiveDatabase } from '../databases';

export const useActiveDatabaseTables = () => {
  const { data: activeDatabase, isLoading: isActiveDatabaseLoading } = useActiveDatabase();
  const isActiveDatabaseReady = activeDatabase && !isActiveDatabaseLoading;

  return useGetTablesQuery(isActiveDatabaseReady ? { databaseId: activeDatabase.id } : skipToken);
};
