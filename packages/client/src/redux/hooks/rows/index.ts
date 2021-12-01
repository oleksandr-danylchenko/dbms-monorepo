import { skipToken } from '@reduxjs/toolkit/query';
import { useGetRowsProjectionQuery, useGetRowsQuery } from '../../queries/rows';
import { useActiveTable } from '../tables';

export const useActiveTableRows = () => {
  const { data: activeTable, isLoading: isActiveTableLoading } = useActiveTable();
  const isActiveTableReady = activeTable && !isActiveTableLoading;

  return useGetRowsQuery(
    isActiveTableReady ? { databaseId: activeTable.databaseId, tableId: activeTable.id } : skipToken
  );
};

export const useActiveTableProjectionRows = (columnsIds: string[]) => {
  const { data: activeTable, isLoading: isActiveTableLoading } = useActiveTable();
  const isActiveTableReady = activeTable && !isActiveTableLoading;

  return useGetRowsProjectionQuery(
    isActiveTableReady ? { databaseId: activeTable.databaseId, tableId: activeTable.id, columnsIds } : skipToken
  );
};
