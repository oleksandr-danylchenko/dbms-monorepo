import { FC, useCallback, useState } from 'react';
import DatabasesSidebar from './Sidebar';
import DatabasesCards from './Cards';
import PageLayout from '../../components/PageLayout';
import DatabaseModifyModal from './ModifyModal';
import DatabaseDeleteModal from './DeleteModal';
import DatabaseCreateModal from './CreateModal';

const Databases: FC = () => {
  const [isCreatingDatabase, setCreatingDatabase] = useState(false);
  const [editDatabaseId, setEditDatabaseId] = useState<string>();
  const [deleteDatabaseId, setDeleteDatabaseId] = useState<string>();

  const handleDatabaseCreateClick = useCallback(() => setCreatingDatabase(true), []);
  const handleDatabaseEditClick = useCallback(
    ({ databaseId }: { databaseId: string }) => setEditDatabaseId(databaseId),
    []
  );
  const handleDatabaseDeleteClick = useCallback(
    ({ databaseId }: { databaseId: string }) => setDeleteDatabaseId(databaseId),
    []
  );

  return (
    <>
      <PageLayout
        header="Databases"
        sidebar={<DatabasesSidebar />}
        content={
          <DatabasesCards
            onCreateClick={handleDatabaseCreateClick}
            onEditClick={handleDatabaseEditClick}
            onDeleteClick={handleDatabaseDeleteClick}
          />
        }
      />
      {isCreatingDatabase && <DatabaseCreateModal onClose={() => setCreatingDatabase(false)} />}
      {editDatabaseId && (
        <DatabaseModifyModal databaseId={editDatabaseId} onClose={() => setEditDatabaseId(undefined)} />
      )}
      {deleteDatabaseId && (
        <DatabaseDeleteModal databaseId={deleteDatabaseId} onClose={() => setDeleteDatabaseId(undefined)} />
      )}
    </>
  );
};

export default Databases;
