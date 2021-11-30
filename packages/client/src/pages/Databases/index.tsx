import { FC } from 'react';
import { useHistory } from 'react-router';
import { Header, Segment, Sidebar } from 'semantic-ui-react';
import { useGetDatabasesQuery } from '../../redux/queries/databases';
import { useAppSelector } from '../../redux/hooks/app/useAppSelector';
import { selectAllDatabases } from '../../redux/selectors/databases';
import DatabasesSidebar from './Sidebar';
import styles from './styles.module.scss';

const Databases: FC = () => {
  const history = useHistory();

  const { isLoading: isDatabasesLoading, error: databasesError } = useGetDatabasesQuery();
  const databases = useAppSelector(selectAllDatabases);

  console.log(databases);

  return (
    <Sidebar.Pushable as={Segment} className={styles.Databases}>
      <DatabasesSidebar />
      <Sidebar.Pusher>
        <Segment basic>
          <Header as="h3">Application Contenthfdhdf</Header>
        </Segment>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
};

export default Databases;
