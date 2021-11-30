import { FC, useMemo } from 'react';
import { Header, Menu, Placeholder, Sidebar } from 'semantic-ui-react';
import { useGetDatabasesQuery } from '../../../redux/queries/databases';
import { selectAllDatabases } from '../../../redux/selectors/databases';
import { useAppSelector } from '../../../redux/hooks/app/useAppSelector';
import { selectActiveDatabaseId } from '../../../redux/selectors/application';
import styles from './styles.module.scss';

const DatabasesSidebar: FC = () => {
  const activeDatabaseId = useAppSelector(selectActiveDatabaseId);

  const { isLoading: isDatabasesLoading, error: databasesError } = useGetDatabasesQuery();
  const databases = useAppSelector(selectAllDatabases);

  const menuPlaceholderElement = useMemo(() => {
    const placeholderMenuElementsAmount = 5;
    return [...Array(placeholderMenuElementsAmount).keys()].map((value) => (
      <Menu.Item key={value}>
        <Placeholder>
          <Placeholder.Header>
            <Placeholder.Line />
          </Placeholder.Header>
          <Placeholder.Paragraph>
            <Placeholder.Line />
          </Placeholder.Paragraph>
        </Placeholder>
      </Menu.Item>
    ));
  }, []);

  return (
    <Sidebar animation="push" vertical visible={!databasesError}>
      <Header className={styles.DatabasesSidebar__Header}>Databases</Header>
      <Menu vertical fluid className={styles.DatabasesSidebar__Menu}>
        {isDatabasesLoading ? (
          menuPlaceholderElement
        ) : (
          <>
            {databases.map((database) => (
              <Menu.Item key={database.id}>
                <Menu.Header>{database.name}</Menu.Header>
                <Menu.Menu>
                  <Menu.Item active={database.id === activeDatabaseId}>{database.id}</Menu.Item>
                </Menu.Menu>
              </Menu.Item>
            ))}
          </>
        )}
      </Menu>
    </Sidebar>
  );
};

export default DatabasesSidebar;
