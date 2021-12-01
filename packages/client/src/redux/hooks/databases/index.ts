import { skipToken } from '@reduxjs/toolkit/query';
import { useAppSelector } from '../app/useAppSelector';
import { selectActiveDatabaseId } from '../../selectors/application';
import { useGetDatabaseQuery } from '../../queries/databases';

export const useActiveDatabase = () => {
  const activeDatabaseId = useAppSelector(selectActiveDatabaseId);
  return useGetDatabaseQuery(activeDatabaseId ? { databaseId: activeDatabaseId } : skipToken);
};
