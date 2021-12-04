import { FC, useCallback, useState } from 'react';
import DatabasesSidebar from './Sidebar';
import DatabasesCards from './Cards';
import PageLayout from '../../components/PageLayout';
import DatabaseModifyModal from './ModifyModal';
import DatabaseDeleteModal from './DeleteModal';

const Databases: FC = () => {
  const [editDatabaseId, setEditDatabaseId] = useState<string>();
  const [deleteDatabaseId, setDeleteDatabaseId] = useState<string>();

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
        content={<DatabasesCards onEditClick={handleDatabaseEditClick} onDeleteClick={handleDatabaseDeleteClick} />}
      />
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
