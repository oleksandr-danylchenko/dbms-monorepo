import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import PageLayout from '../../components/PageLayout';
import TablesSidebar from './Sidebar';
import { useAppDispatch } from '../../redux/hooks/app/useAppDispatch';
import { updateActiveIds } from '../../redux/slices/application';
import TablesCards from './Cards';
import { useActiveDatabase } from '../../redux/hooks/databases';
import TableDeleteModal from './DeleteModal';
import TableCreateModal from './CreateModal';
import TableModifyModal from './ModifyModal';

const Tables: FC = () => {
  const dispatch = useAppDispatch();

  const [isCreatingTable, setCreatingTable] = useState(false);
  const [editTableId, setEditTableId] = useState<string>();
  const [deleteTableId, setDeleteTableId] = useState<string>();

  const { databaseId: paramsDatabaseId } = useParams<{ databaseId: string }>();
  const { data: activeDatabase } = useActiveDatabase();

  useEffect(() => {
    dispatch(updateActiveIds({ databaseId: paramsDatabaseId }));
  }, [dispatch, paramsDatabaseId]);

  return (
    <>
      <PageLayout
        header={<>Tables {activeDatabase?.name && `for ${activeDatabase.name}`}</>}
        backLink="/databases"
        sidebar={<TablesSidebar />}
        content={<TablesCards />}
      />
      {isCreatingTable && <TableCreateModal onClose={() => setCreatingTable(false)} />}
      {editTableId && <TableModifyModal tableId={editTableId} onClose={() => setEditTableId(undefined)} />}
      {deleteTableId && <TableDeleteModal tableId={deleteTableId} onClose={() => setDeleteTableId(undefined)} />}
    </>
  );
};

export default Tables;
