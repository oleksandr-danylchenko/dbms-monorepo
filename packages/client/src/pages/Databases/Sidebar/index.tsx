import { FC, useCallback, useMemo } from 'react';
import { Menu } from 'semantic-ui-react';
import { useHistory } from 'react-router';
import { useGetDatabasesQuery } from '../../../redux/queries/databases';
import { useAppSelector } from '../../../redux/hooks/app/useAppSelector';
import { selectAllDatabases } from '../../../redux/selectors/databases';
import PageSidebar from '../../../components/PageSidebar';
import { selectActiveDatabaseId } from '../../../redux/selectors/application';

const DatabasesSidebar: FC = () => {
  const history = useHistory();

  const activeDatabaseId = useAppSelector(selectActiveDatabaseId);

  const { isLoading: isDatabasesLoading, error: databasesError } = useGetDatabasesQuery();
  const databases = useAppSelector(selectAllDatabases);

  const handleDatabaseClick = useCallback(
    (databaseId: string): void => {
      history.push(`/databases/${databaseId}/tables`);
    },
    [history]
  );

  const databasesSidebarItems = useMemo(
    () =>
      databases.map((database) => (
        <Menu.Item
          key={database.id}
          link
          active={database.id === activeDatabaseId}
          onClick={() => handleDatabaseClick(database.id)}
        >
          <Menu.Header>{database.name}</Menu.Header>
          <Menu.Menu>
            <Menu.Item>{database.id}</Menu.Item>
          </Menu.Menu>
        </Menu.Item>
      )),
    [activeDatabaseId, databases, handleDatabaseClick]
  );

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
