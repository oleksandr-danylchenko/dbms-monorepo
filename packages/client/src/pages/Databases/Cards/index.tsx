import { FC } from 'react';
import { Card, Header, Segment, Sidebar } from 'semantic-ui-react';
import styles from './styles.module.scss';
import { useAppSelector } from '../../../redux/hooks/app/useAppSelector';
import { useGetDatabasesQuery } from '../../../redux/queries/databases';
import { selectAllDatabases } from '../../../redux/selectors/databases';

const DatabasesCards: FC = () => {
  const { isLoading: isDatabasesLoading, error: databasesError } = useGetDatabasesQuery();
  const databases = useAppSelector(selectAllDatabases);

  return (
    <Card.Group centered doubling stackable>
      <Card
        href="#card-example-link-card"
        header="Elliot Baker"
        meta="Friend"
        description="Elliot is a sound engineer living in Nashville who enjoys playing guitar and hanging with his cat."
      />
      <Card
        href="#card-example-link-card"
        header="Elliot Baker"
        meta="Friend"
        description="Elliot is a sound engineer living in Nashville who enjoys playing guitar and hanging with his cat."
      />
      <Card
        href="#card-example-link-card"
        header="Elliot Baker"
        meta="Friend"
        description="Elliot is a sound engineer living in Nashville who enjoys playing guitar and hanging with his cat."
      />
      <Card
        href="#card-example-link-card"
        header="Elliot Baker"
        meta="Friend"
        description="Elliot is a sound engineer living in Nashville who enjoys playing guitar and hanging with his cat."
      />
    </Card.Group>
  );
};

export default DatabasesCards;
