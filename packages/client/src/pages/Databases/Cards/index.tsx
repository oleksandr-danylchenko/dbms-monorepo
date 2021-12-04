import { FC, useCallback, useMemo } from 'react';
import { Card, Icon, Label, Menu, Placeholder } from 'semantic-ui-react';
import { useHistory } from 'react-router';
import { useAppSelector } from '../../../redux/hooks/app/useAppSelector';
import { useGetDatabasesQuery } from '../../../redux/queries/databases';
import { selectNameSortedDatabases } from '../../../redux/selectors/databases';
import { Database } from '../../../models/dbms';
import ErrorHeader from '../../../components/ErrorHeader';
import { toFetchError } from '../../../utils/errors';
import CardActions from '../../../components/CardActions';
import { BindingAction, BindingCallback1 } from '../../../models/functions';
import CreationCard from '../../../components/CreationCard';

interface DatabasesCardsProps {
  onCreateClick: BindingAction;
  onEditClick: BindingCallback1<{ databaseId: string }>;
  onDeleteClick: BindingCallback1<{ databaseId: string; databaseName: string }>;
}

const DatabasesCards: FC<DatabasesCardsProps> = ({ onCreateClick, onEditClick, onDeleteClick }) => {
  const history = useHistory();

  const { isLoading: isDatabasesLoading, error: databasesError } = useGetDatabasesQuery();
  const databases = useAppSelector(selectNameSortedDatabases);

  const handleDatabaseClick = useCallback(
    (databaseId: string): void => {
      history.push(`/databases/${databaseId}/tables`);
    },
    [history]
  );

  const cardsPlaceholderElement = useMemo(() => {
    const placeholderElementsAmount = 4;
    return [...Array(placeholderElementsAmount).keys()].map((value) => (
      <Card key={value}>
        <Card.Content>
          <Placeholder>
            <Placeholder.Header>
              <Placeholder.Line length="long" />
            </Placeholder.Header>
            <Placeholder.Paragraph>
              <Placeholder.Line length="very long" />
              <Placeholder.Line length="long" />
              <Placeholder.Line length="long" />
              <Placeholder.Line length="long" />
            </Placeholder.Paragraph>
          </Placeholder>
        </Card.Content>
      </Card>
    ));
  }, []);

  const creteTablesElements = useCallback((database: Database) => {
    const tables = Object.values(database.tablesIndex);
    if (!tables.length) {
      return (
        <Menu vertical fluid>
          <Menu.Item>
            No tables presented <Icon name="table" />
          </Menu.Item>
        </Menu>
      );
    }

    return (
      <Menu vertical fluid>
        <Menu.Item>
          Tables
          <Label circular color="grey">
            {tables.length}
          </Label>
        </Menu.Item>
        <Menu.Item link>
          Show all
          <Icon name="angle right" />
        </Menu.Item>
      </Menu>
    );
  }, []);

  const databasesCards = useMemo(() => {
    const entitiesCards = databases.map((database) => (
      <Card key={database.id} link onClick={() => handleDatabaseClick(database.id)}>
        <Card.Content>
          <Card.Header>{database.name}</Card.Header>
          <Card.Meta>{database.id}</Card.Meta>
          <Card.Description>{creteTablesElements(database)}</Card.Description>
        </Card.Content>
        <Card.Content extra textAlign="right">
          <CardActions
            onEditClick={() => onEditClick({ databaseId: database.id })}
            onDeleteClick={() => onDeleteClick({ databaseId: database.id, databaseName: database.name })}
          />
        </Card.Content>
      </Card>
    ));
    const creationCard = <CreationCard key="databaseCreation" header="Add a new database" onClick={onCreateClick} />;

    return [entitiesCards, creationCard];
  }, [creteTablesElements, databases, handleDatabaseClick, onCreateClick, onDeleteClick, onEditClick]);

  if (databasesError) {
    const fetchingError = toFetchError(databasesError);
    return <ErrorHeader message={fetchingError.message} submessage={fetchingError.status} />;
  }

  return (
    <Card.Group centered doubling stackable>
      {isDatabasesLoading ? cardsPlaceholderElement : databasesCards}
    </Card.Group>
  );
};

export default DatabasesCards;
