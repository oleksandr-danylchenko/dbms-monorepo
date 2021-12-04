import { FC, useEffect } from 'react';
import { useParams } from 'react-router';
import PageLayout from '../../components/PageLayout';
import { useAppDispatch } from '../../redux/hooks/app/useAppDispatch';
import { updateActiveIds } from '../../redux/slices/application';
import RowsTable from './RowsTable';
import TablesSidebar from '../Tables/Sidebar';
import { useActiveTable } from '../../redux/hooks/tables';

const Rows: FC = () => {
  const dispatch = useAppDispatch();

  const { databaseId: paramsDatabaseId, tableId: paramsTableId } = useParams<{ databaseId: string; tableId: string }>();
  const { data: activeTable } = useActiveTable();

  useEffect(() => {
    dispatch(updateActiveIds({ databaseId: paramsDatabaseId, tableId: paramsTableId }));
  }, [dispatch, paramsDatabaseId, paramsTableId]);

  return (
    <PageLayout
      header={<>Rows {activeTable?.name && `for ${activeTable.name}`}</>}
      backLink={`/databases/${paramsDatabaseId}/tables`}
      sidebar={<TablesSidebar />}
      content={<RowsTable />}
    />
  );
};

export default Rows;
