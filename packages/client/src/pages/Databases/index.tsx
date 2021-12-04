import { FC, useCallback, useState } from 'react';
import DatabasesSidebar from './Sidebar';
import DatabasesCards from './Cards';
import PageLayout from '../../components/PageLayout';
import { useDeleteDatabaseMutation } from '../../redux/queries/databases';
import DatabaseModifyModal from './ModifyModal';

const Databases: FC = () => {
  const [selectedDatabaseId, setSelectedDatabaseId] = useState<string>();
  // const selectedDatabase = useAppSelector((state) => selectDatabaseById(state, selectedDatabaseId || ''));

  const [deleteDatabase] = useDeleteDatabaseMutation();

  const handleDatabaseEditClick = useCallback(({ databaseId }: { databaseId: string }) => {
    setSelectedDatabaseId(databaseId);
  }, []);

  const handleDatabaseDeleteClick = useCallback(
    ({ databaseId, databaseName }: { databaseId: string; databaseName: string }) => {
      // eslint-disable-next-line no-alert
      const shouldDelete = window.confirm(`Do want to delete the database ${databaseName}?`);
      if (shouldDelete) {
        deleteDatabase({ databaseId });
      }
    },
    [deleteDatabase]
  );

  return (
    <>
      <PageLayout
        header="Databases"
        sidebar={<DatabasesSidebar />}
        content={<DatabasesCards onEditClick={handleDatabaseEditClick} onDeleteClick={handleDatabaseDeleteClick} />}
      />
      {selectedDatabaseId && (
        <DatabaseModifyModal databaseId={selectedDatabaseId} onClose={() => setSelectedDatabaseId(undefined)} />
      )}
    </>
  );
};

export default Databases;
