import { FC, useCallback, useMemo } from 'react';
import { Card, Icon, Label, Menu, Placeholder } from 'semantic-ui-react';
import { useHistory } from 'react-router';
import { useAppSelector } from '../../../redux/hooks/app/useAppSelector';
import { useAppDispatch } from '../../../redux/hooks/app/useAppDispatch';
import { Table } from '../../../models/dbms';
import ErrorHeader from '../../../components/ErrorHeader';
import { toFetchError } from '../../../utils/errors';
import { useActiveDatabaseTables } from '../../../redux/hooks/tables';
import { selectAllTables } from '../../../redux/selectors/tables';
import { selectActiveDatabaseId } from '../../../redux/selectors/application';
import styles from './styles.module.scss';

const TablesCards: FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const activeDatabaseId = useAppSelector(selectActiveDatabaseId);

  const {
    isLoading: isTablesLoading,
    isUninitialized: isTablesUninitialized,
    error: tablesError,
  } = useActiveDatabaseTables();
  const tables = useAppSelector(selectAllTables);

  const handleTableClick = useCallback(
    (tableId: string): void => {
      history.push(`/databases/${activeDatabaseId}/tables/${tableId}/rows`);
    },
    [activeDatabaseId, history]
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

  const creteColumnsElements = useCallback((table: Table) => {
    const { columnsIndex } = table;
    const columns = Object.values(columnsIndex);
    if (!columns.length) {
      return (
        <Menu vertical fluid>
          <Menu.Item>
            No columns presented <Icon name="columns" />
          </Menu.Item>
        </Menu>
      );
    }

    const columnsOrder = table.columnsOrderIndex;

    return (
      <Menu vertical fluid>
        <Menu.Item>
          Columns
          <Label circular color="grey">
            {columns.length}
          </Label>
        </Menu.Item>
        {columnsOrder.map((columnId) => {
          const { name: columnName, type: columnType } = columnsIndex[columnId];
          return (
            <Menu.Item key={columnId} className={styles.TablesCards__Column}>
              <span>{columnName}</span> <strong>{columnType}</strong>
            </Menu.Item>
          );
        })}
      </Menu>
    );
  }, []);

  const tablesCards = useMemo(
    () =>
      tables.map((table) => (
        <Card key={table.id} link onClick={() => handleTableClick(table.id)}>
          <Card.Content>
            <Card.Header>{table.name}</Card.Header>
            <Card.Meta>{table.id}</Card.Meta>
            <Card.Description>{creteColumnsElements(table)}</Card.Description>
          </Card.Content>
        </Card>
      )),
    [creteColumnsElements, handleTableClick, tables]
  );

  if (tablesError) {
    const fetchingError = toFetchError(tablesError);
    return <ErrorHeader message={fetchingError.message} submessage={fetchingError.status} />;
  }

  return (
    <Card.Group centered doubling stackable>
      {isTablesLoading || isTablesUninitialized ? cardsPlaceholderElement : tablesCards}
    </Card.Group>
  );
};

export default TablesCards;
