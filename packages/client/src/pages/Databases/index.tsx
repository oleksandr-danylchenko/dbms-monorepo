import { FC, useCallback, useState } from 'react';
import DatabasesSidebar from './Sidebar';
import DatabasesCards from './Cards';
import PageLayout from '../../components/PageLayout';
import DeleteModal from '../../components/DeleteModal';
import { useAppSelector } from '../../redux/hooks/app/useAppSelector';
import { selectDatabaseById } from '../../redux/selectors/databases';
import { useDeleteDatabaseMutation } from '../../redux/queries/databases';

const Databases: FC = () => {
  const [selectedDatabaseId, setSelectedDatabaseId] = useState<string>();
  const selectedDatabase = useAppSelector((state) => selectDatabaseById(state, selectedDatabaseId || ''));

  const [deleteDatabase] = useDeleteDatabaseMutation();

  const handleDatabaseEditClick = useCallback(({ databaseId }: { databaseId: string }) => {
    setSelectedDatabaseId(databaseId);
  }, []);

  const handleDatabaseDeleteClick = useCallback(({ databaseId }: { databaseId: string }) => {
    setSelectedDatabaseId(databaseId);
  }, []);

  const handleDatabaseDeletePermitClick = useCallback(() => {
    if (!selectedDatabaseId) return;
    deleteDatabase({ databaseId: selectedDatabaseId });
    setSelectedDatabaseId(undefined);
  }, [deleteDatabase, selectedDatabaseId]);

  const handleDatabaseCancelClick = useCallback(() => {
    setSelectedDatabaseId(undefined);
  }, []);

  return (
    <>
      <PageLayout
        header="Databases"
        sidebar={<DatabasesSidebar />}
        content={<DatabasesCards onEditClick={handleDatabaseEditClick} onDeleteClick={handleDatabaseDeleteClick} />}
      />
      <DeleteModal
        open={!!selectedDatabaseId}
        entityName={`database ${selectedDatabase?.name}`}
        onCancel={handleDatabaseCancelClick}
        onPermit={handleDatabaseDeletePermitClick}
      />
    </>
  );
};

export default Databases;
