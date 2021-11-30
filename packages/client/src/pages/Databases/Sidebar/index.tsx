import { FC, useMemo } from 'react';
import { Menu } from 'semantic-ui-react';
import { useGetDatabasesQuery } from '../../../redux/queries/databases';
import { useAppSelector } from '../../../redux/hooks/app/useAppSelector';
import { selectAllDatabases } from '../../../redux/selectors/databases';
import PageSidebar from '../../../components/PageSidebar';
import { selectActiveDatabaseId } from '../../../redux/selectors/application';

const DatabasesSidebar: FC = () => {
  const activeDatabaseId = useAppSelector(selectActiveDatabaseId);

  const { isLoading: isDatabasesLoading, error: databasesError } = useGetDatabasesQuery();
  const databases = useAppSelector(selectAllDatabases);

  const databasesSidebarItems = useMemo(() => {
    return databases.map((database) => (
      <Menu.Item key={database.id}>
        <Menu.Header>{database.name}</Menu.Header>
        <Menu.Menu>
          <Menu.Item active={database.id === activeDatabaseId}>{database.id}</Menu.Item>
        </Menu.Menu>
      </Menu.Item>
    ));
  }, [activeDatabaseId, databases]);

  return (
    <PageSidebar
      title="Databases"
      items={databasesSidebarItems}
      isLoading={isDatabasesLoading}
      error={!!databasesError}
    />
  );
};

export default DatabasesSidebar;
