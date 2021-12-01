import { FC, useMemo } from 'react';
import { Card, Container, Label, Placeholder, Table as UiTable } from 'semantic-ui-react';
import { useHistory } from 'react-router';
import { useAppSelector } from '../../../redux/hooks/app/useAppSelector';
import { Table } from '../../../models/dbms';
import { useActiveTable } from '../../../redux/hooks/tables';
import { selectActiveDatabaseId } from '../../../redux/selectors/application';
import { toFetchError } from '../../../utils/errors';
import ErrorHeader from '../../../components/ErrorHeader';

const RowsTable: FC = () => {
  const history = useHistory();

  const activeDatabaseId = useAppSelector(selectActiveDatabaseId);
  const { data: activeTable, isLoading: isActiveTableLoading, error: activeTableError } = useActiveTable();

  const tablePlaceholderElement = useMemo(() => {
    const placeholderRowsAmount = 5;
    return (
      <Container text>
        <Placeholder fluid>
          <Placeholder.Header>
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
          {[...Array(placeholderRowsAmount).keys()].map((value) => (
            <Placeholder.Paragraph key={value}>
              <Placeholder.Line />
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Paragraph>
          ))}
        </Placeholder>
      </Container>
    );
  }, []);

  if (isActiveTableLoading) {
    return tablePlaceholderElement;
  }

  if (activeTableError) {
    const fetchingError = toFetchError(activeTableError);
    return <ErrorHeader message={fetchingError.message} submessage={fetchingError.status} />;
  }

  return (
    <UiTable celled>
      <UiTable.Header>
        <UiTable.Row>
          {activeTable?.columnsOrderIndex?.map((columnId) => {
            const { name: columnName } = activeTable.columnsIndex[columnId];
            return <UiTable.HeaderCell>{columnName}</UiTable.HeaderCell>;
          })}
        </UiTable.Row>
      </UiTable.Header>
      <UiTable.Body>
        <UiTable.Row>
          {activeTable?.columnsOrderIndex?.map((columnId) => {
            const { name: columnName } = activeTable.columnsIndex[columnId];
            return <UiTable.Cell>{columnName}</UiTable.Cell>;
          })}
        </UiTable.Row>
      </UiTable.Body>
    </UiTable>
  );
};

export default RowsTable;
