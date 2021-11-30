import { FC, useMemo } from 'react';
import { Card, Icon, Menu, Placeholder } from 'semantic-ui-react';
import { useHistory } from 'react-router';
import { useAppSelector } from '../../../redux/hooks/app/useAppSelector';
import { useGetDatabasesQuery } from '../../../redux/queries/databases';
import { selectAllDatabases } from '../../../redux/selectors/databases';
import { useAppDispatch } from '../../../redux/hooks/app/useAppDispatch';
import { updateActiveIds } from '../../../redux/slices/application';
import { selectActiveDatabaseId } from '../../../redux/selectors/application';

const DatabasesCards: FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const activeDatabaseId = useAppSelector(selectActiveDatabaseId);

  const { isLoading: isDatabasesLoading, error: databasesError } = useGetDatabasesQuery();
  const databases = useAppSelector(selectAllDatabases);

  const handleTableClick = (tableId: string): void => {
    dispatch(updateActiveIds({ tableId }));
    history.push(`/databases/${activeDatabaseId}/table/${tableId}`);
  };

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

  const databasesCards = useMemo(
    () =>
      databases.map((database) => (
        <Card key={database.id} link>
          <Card.Content>
            <Card.Header>{database.name}</Card.Header>
            <Card.Meta>{database.id}</Card.Meta>
            <Card.Description>
              <Menu vertical fluid>
                {!Object.values(database.tablesIndex).length && (
                  <Menu.Item>
                    <Icon name="dont" />
                    No tables presented
                  </Menu.Item>
                )}
                {Object.values(database.tablesIndex).map((table) => (
                  <Menu.Item key={table.id} onClick={() => handleTableClick(table.id)}>
                    {table.id}
                  </Menu.Item>
                ))}
              </Menu>
            </Card.Description>
          </Card.Content>
        </Card>
      )),
    [databases, handleTableClick]
  );

  return (
    <Card.Group centered doubling stackable>
      {isDatabasesLoading ? cardsPlaceholderElement : databasesCards}
    </Card.Group>
  );
};

export default DatabasesCards;
