import { skipToken } from '@reduxjs/toolkit/query';
import { useGetTableQuery, useGetTablesQuery } from '../../queries/tables';
import { useActiveDatabase } from '../databases';
import { useAppSelector } from '../app/useAppSelector';
import { selectActiveDatabaseId, selectActiveTableId } from '../../selectors/application';

export const useActiveDatabaseTables = () => {
  const { data: activeDatabase, isLoading: isActiveDatabaseLoading } = useActiveDatabase();
  const isActiveDatabaseReady = activeDatabase && !isActiveDatabaseLoading;

  return useGetTablesQuery(isActiveDatabaseReady ? { databaseId: activeDatabase.id } : skipToken);
};

export const useActiveTable = () => {
  const activeDatabaseId = useAppSelector(selectActiveDatabaseId);
  const activeTableId = useAppSelector(selectActiveTableId);
  return useGetTableQuery(
    activeDatabaseId && activeTableId ? { databaseId: activeDatabaseId, tableId: activeTableId } : skipToken
  );
};
