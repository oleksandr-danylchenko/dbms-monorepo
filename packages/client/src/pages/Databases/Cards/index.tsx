import { FC, useCallback, useMemo } from 'react';
import { Card, Icon, Label, Menu, Placeholder } from 'semantic-ui-react';
import { useHistory } from 'react-router';
import { useAppSelector } from '../../../redux/hooks/app/useAppSelector';
import { useGetDatabasesQuery } from '../../../redux/queries/databases';
import { selectAllDatabases } from '../../../redux/selectors/databases';
import { useAppDispatch } from '../../../redux/hooks/app/useAppDispatch';
import { updateActiveIds } from '../../../redux/slices/application';
import { Database } from '../../../models/dbms';
import ErrorHeader from '../../../components/ErrorHeader';
import { toFetchError } from '../../../utils/errors';

const DatabasesCards: FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const { isLoading: isDatabasesLoading, error: databasesError } = useGetDatabasesQuery();
  const databases = useAppSelector(selectAllDatabases);

  const handleDatabaseClick = useCallback(
    (databaseId: string): void => {
      dispatch(updateActiveIds({ databaseId }));
      history.push(`/databases/${databaseId}/tables`);
    },
    [dispatch, history]
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
            No tables presented <Icon name="dont" />
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

  const databasesCards = useMemo(
    () =>
      databases.map((database) => (
        <Card key={database.id} link onClick={() => handleDatabaseClick(database.id)}>
          <Card.Content>
            <Card.Header>{database.name}</Card.Header>
            <Card.Meta>{database.id}</Card.Meta>
            <Card.Description>{creteTablesElements(database)}</Card.Description>
          </Card.Content>
        </Card>
      )),
    [creteTablesElements, databases, handleDatabaseClick]
  );

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
