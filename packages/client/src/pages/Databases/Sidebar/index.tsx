import { FC, useCallback, useMemo } from 'react';
import { Menu } from 'semantic-ui-react';
import { useHistory } from 'react-router';
import { useGetDatabasesQuery } from '../../../redux/queries/databases';
import { useAppSelector } from '../../../redux/hooks/app/useAppSelector';
import { selectAllDatabases } from '../../../redux/selectors/databases';
import PageSidebar from '../../../components/PageSidebar';
import { selectActiveDatabaseId } from '../../../redux/selectors/application';
import { useAppDispatch } from '../../../redux/hooks/app/useAppDispatch';
import { updateActiveIds } from '../../../redux/slices/application';

const DatabasesSidebar: FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const activeDatabaseId = useAppSelector(selectActiveDatabaseId);

  const { isLoading: isDatabasesLoading, error: databasesError } = useGetDatabasesQuery();
  const databases = useAppSelector(selectAllDatabases);

  const handleDatabaseClick = useCallback(
    (databaseId: string): void => {
      dispatch(updateActiveIds({ databaseId }));
      history.push(`/databases/${databaseId}`);
    },
    [dispatch, history]
  );

  const databasesSidebarItems = useMemo(() => {
    return databases.map((database) => (
      <Menu.Item
        key={database.id}
        active={database.id === activeDatabaseId}
        onClick={() => handleDatabaseClick(database.id)}
      >
        <Menu.Header>{database.name}</Menu.Header>
        <Menu.Menu>
          <Menu.Item>{database.id}</Menu.Item>
        </Menu.Menu>
      </Menu.Item>
    ));
  }, [activeDatabaseId, databases, handleDatabaseClick]);

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
