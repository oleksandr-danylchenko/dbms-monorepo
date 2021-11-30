import { FC } from 'react';
import { Card, Icon, Menu } from 'semantic-ui-react';
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

  return (
    <Card.Group centered doubling stackable>
      {databases.map((database) => (
        <Card>
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
                  <Menu.Item onClick={() => handleTableClick(table.id)}>{table.id}</Menu.Item>
                ))}
              </Menu>
            </Card.Description>
          </Card.Content>
        </Card>
      ))}
    </Card.Group>
  );
};

export default DatabasesCards;
