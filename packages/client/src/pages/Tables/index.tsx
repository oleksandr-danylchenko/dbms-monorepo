import { FC, useEffect } from 'react';
import { useParams } from 'react-router';
import PageLayout from '../../components/PageLayout';
import TablesSidebar from './Sidebar';
import { useAppDispatch } from '../../redux/hooks/app/useAppDispatch';
import { updateActiveIds } from '../../redux/slices/application';
import TablesCards from './Cards';

const Tables: FC = () => {
  const dispatch = useAppDispatch();

  const { databaseId: paramsDatabaseId } = useParams<{ databaseId: string }>();

  useEffect(() => {
    dispatch(updateActiveIds({ databaseId: paramsDatabaseId }));
  }, [dispatch, paramsDatabaseId]);

  return <PageLayout sidebar={<TablesSidebar />} content={<TablesCards />} />;
};

export default Tables;
