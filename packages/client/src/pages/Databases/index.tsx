import { FC } from 'react';
import { useHistory } from 'react-router';
import { Grid, Header, Segment, Sidebar } from 'semantic-ui-react';
import { useGetDatabasesQuery } from '../../redux/queries/databases';
import { useAppSelector } from '../../redux/hooks/app/useAppSelector';
import { selectAllDatabases } from '../../redux/selectors/databases';
import styles from './styles.module.scss';
import DatabasesSidebar from './Sidebar';
import DatabasesCards from './Cards';

const Databases: FC = () => {
  const history = useHistory();

  const { isLoading: isDatabasesLoading, error: databasesError } = useGetDatabasesQuery();
  const databases = useAppSelector(selectAllDatabases);

  return (
    <Grid row={1} columns="equal" padded="vertically" className={styles.Databases__Content}>
      <Grid.Column width={3}>
        <DatabasesSidebar />
      </Grid.Column>
      <Grid.Column>
        <DatabasesCards />
      </Grid.Column>
    </Grid>
  );
};

export default Databases;
