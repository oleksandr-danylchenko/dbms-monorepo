import { FC, useEffect } from 'react';
import { useParams } from 'react-router';
import PageLayout from '../../components/PageLayout';
import { useAppDispatch } from '../../redux/hooks/app/useAppDispatch';
import { updateActiveIds } from '../../redux/slices/application';
import RowsTable from './Table';
import TablesSidebar from '../Tables/Sidebar';

const Rows: FC = () => {
  const dispatch = useAppDispatch();

  const { databaseId: paramsDatabaseId, tableId: paramsTableId } = useParams<{ databaseId: string; tableId: string }>();

  useEffect(() => {
    dispatch(updateActiveIds({ databaseId: paramsDatabaseId, tableId: paramsTableId }));
  }, [dispatch, paramsDatabaseId, paramsTableId]);

  return (
    <PageLayout
      header="Table rows"
      backLink={`/databases/${paramsDatabaseId}/tables`}
      sidebar={<TablesSidebar />}
      content={<RowsTable />}
    />
  );
};

export default Rows;
