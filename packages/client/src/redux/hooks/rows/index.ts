import { skipToken } from '@reduxjs/toolkit/query';
import { useGetRowsProjectionQuery, useGetRowsQuery } from '../../queries/rows';
import { useActiveTable } from '../tables';

export const useActiveTableRows = () => {
  const { data: activeTable, isFetching: isActiveTableFetching } = useActiveTable();
  const isActiveTableReady = activeTable && !isActiveTableFetching;

  return useGetRowsQuery(
    isActiveTableReady ? { databaseId: activeTable.databaseId, tableId: activeTable.id } : skipToken
  );
};

export const useActiveTableProjectionRows = (columnsIds: string[]) => {
  const { data: activeTable, isFetching: isActiveTableFetching } = useActiveTable();
  const isActiveTableReady = activeTable && !isActiveTableFetching;

  return useGetRowsProjectionQuery(
    isActiveTableReady ? { databaseId: activeTable.databaseId, tableId: activeTable.id, columnsIds } : skipToken
  );
};
