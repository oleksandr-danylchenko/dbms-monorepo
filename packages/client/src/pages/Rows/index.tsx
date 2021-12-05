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
import TableModifyModal from '../Tables/ModifyModal';

const Rows: FC = () => {
  const dispatch = useAppDispatch();

  const [isCreatingRow, setCreatingRow] = useState(false);
  const [deleteRowId, setDeleteRowId] = useState<string>();

  const [editTableId, setEditTableId] = useState<string>();

  const { databaseId: paramsDatabaseId, tableId: paramsTableId } = useParams<{ databaseId: string; tableId: string }>();
  useEffect(() => {
    dispatch(updateActiveIds({ databaseId: paramsDatabaseId, tableId: paramsTableId }));
  }, [dispatch, paramsDatabaseId, paramsTableId]);

  const handleRowCreateClick = useCallback(() => setCreatingRow(true), []);
  const handleRowDeleteClick = useCallback(({ rowId }: { rowId: string }) => setDeleteRowId(rowId), []);

  const handleTableEditClick = useCallback(({ tableId }: { tableId: string }) => setEditTableId(tableId), []);

  return (
    <>
      <PageLayout
        header={<RowsHeader onCreateClick={handleRowCreateClick} />}
        backLink={`/databases/${paramsDatabaseId}/tables`}
        sidebar={<TablesSidebar />}
        content={<RowsTable onDeleteClick={handleRowDeleteClick} onTableEditClick={handleTableEditClick} />}
      />
      {isCreatingRow && <RowsCreateModal onClose={() => setCreatingRow(false)} />}
      {deleteRowId && <RowDeleteModal rowId={deleteRowId} onClose={() => setDeleteRowId(undefined)} />}
      {editTableId && <TableModifyModal tableId={editTableId} onClose={() => setEditTableId(undefined)} />}
    </>
  );
};

export default Rows;
