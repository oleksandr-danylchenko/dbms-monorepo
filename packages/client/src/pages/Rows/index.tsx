import { FC, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import PageLayout from '../../components/PageLayout';
import { useAppDispatch } from '../../redux/hooks/app/useAppDispatch';
import { updateActiveIds } from '../../redux/slices/application';
import RowsTable from './RowsTable';
import TablesSidebar from '../Tables/Sidebar';
import RowsHeader from './Header';
import RowsCreateModal from './CreateModal';
import RowDeleteModal from './DeleteModal';

const Rows: FC = () => {
  const dispatch = useAppDispatch();

  const [isCreatingRow, setCreatingRow] = useState(false);
  const [deleteRowId, setDeleteRowId] = useState<string>();

  const { databaseId: paramsDatabaseId, tableId: paramsTableId } = useParams<{ databaseId: string; tableId: string }>();
  useEffect(() => {
    dispatch(updateActiveIds({ databaseId: paramsDatabaseId, tableId: paramsTableId }));
  }, [dispatch, paramsDatabaseId, paramsTableId]);

  const handleRowCreateClick = useCallback(() => setCreatingRow(true), []);
  const handleTableDeleteClick = useCallback(({ rowId }: { rowId: string }) => setDeleteRowId(rowId), []);

  return (
    <>
      <PageLayout
        header={<RowsHeader onCreateClick={handleRowCreateClick} />}
        backLink={`/databases/${paramsDatabaseId}/tables`}
        sidebar={<TablesSidebar />}
        content={<RowsTable onDeleteClick={handleTableDeleteClick} />}
      />
      {isCreatingRow && <RowsCreateModal onClose={() => setCreatingRow(false)} />}
      {deleteRowId && <RowDeleteModal rowId={deleteRowId} onClose={() => setDeleteRowId(undefined)} />}
    </>
  );
};

export default Rows;
