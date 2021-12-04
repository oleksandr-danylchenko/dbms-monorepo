import { FC, useCallback } from 'react';
import DatabasesSidebar from './Sidebar';
import DatabasesCards from './Cards';
import PageLayout from '../../components/PageLayout';

const Databases: FC = () => {
  const handleDatabaseEditClick = useCallback(({ databaseId }: { databaseId: string }) => {
    console.log('Editing', databaseId);
  }, []);

  const handleDatabaseDeleteClick = useCallback(({ databaseId }: { databaseId: string }) => {
    console.log('Deleting', databaseId);
  }, []);

  return (
    <PageLayout
      header="Databases"
      sidebar={<DatabasesSidebar />}
      content={<DatabasesCards onEditClick={handleDatabaseEditClick} onDeleteClick={handleDatabaseDeleteClick} />}
    />
  );
};

export default Databases;
