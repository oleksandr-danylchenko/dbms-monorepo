import { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import PageLayout from '../../components/PageLayout';
import { useAppDispatch } from '../../redux/hooks/app/useAppDispatch';
import { updateActiveIds } from '../../redux/slices/application';
import RowsTable from './RowsTable';
import TablesSidebar from '../Tables/Sidebar';
import RowsHeader from './Header';
import RowsCreateModal from './CreateModal';

const Rows: FC = () => {
  const dispatch = useAppDispatch();

  const [isCreatingRow, setCreatingRow] = useState(false);

  const { databaseId: paramsDatabaseId, tableId: paramsTableId } = useParams<{ databaseId: string; tableId: string }>();
  useEffect(() => {
    dispatch(updateActiveIds({ databaseId: paramsDatabaseId, tableId: paramsTableId }));
  }, [dispatch, paramsDatabaseId, paramsTableId]);

  const handleRowCreateClick = useCallback(() => setCreatingRow(true), []);

  return (
    <>
      <PageLayout
        header={<RowsHeader onCreateClick={handleRowCreateClick} />}
        backLink={`/databases/${paramsDatabaseId}/tables`}
        sidebar={<TablesSidebar />}
        content={<RowsTable />}
      />
      {isCreatingRow && <RowsCreateModal onClose={() => setCreatingRow(false)} />}
    </>
  );
};

export default Rows;
