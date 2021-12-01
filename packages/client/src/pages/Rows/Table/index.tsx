import { FC, useMemo } from 'react';
import { Container, Placeholder, Table as UiTable } from 'semantic-ui-react';
import { useAppSelector } from '../../../redux/hooks/app/useAppSelector';
import { useActiveTable } from '../../../redux/hooks/tables';
import { toFetchError } from '../../../utils/errors';
import ErrorHeader from '../../../components/ErrorHeader';
import { useActiveTableRows } from '../../../redux/hooks/rows';
import { selectAllRows } from '../../../redux/selectors/rows';

const RowsTable: FC = () => {
  const { data: activeTable, isLoading: isActiveTableLoading, error: activeTableError } = useActiveTable();

  const { isLoading, error: rowsError } = useActiveTableRows();
  const rows = useAppSelector(selectAllRows);

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

  if (isActiveTableLoading || isLoading) {
    return tablePlaceholderElement;
  }

  if (activeTableError || rowsError) {
    const sharedError = activeTableError || rowsError;
    const fetchingError = toFetchError(sharedError);
    return <ErrorHeader message={fetchingError.message} submessage={fetchingError.status} />;
  }

  return (
    <UiTable celled>
      <UiTable.Header>
        <UiTable.Row>
          {activeTable?.columnsOrderIndex?.map((columnId) => {
            const { name: columnName } = activeTable.columnsIndex[columnId];
            return <UiTable.HeaderCell key={columnId}>{columnName}</UiTable.HeaderCell>;
          })}
        </UiTable.Row>
      </UiTable.Header>
      <UiTable.Body>
        {rows.map((row) => (
          <UiTable.Row key={row.id}>
            {activeTable?.columnsOrderIndex?.map((columnId) => {
              const { value } = row.columnsValuesIndex[columnId];
              return <UiTable.Cell key={columnId}>{value}</UiTable.Cell>;
            })}
          </UiTable.Row>
        ))}
      </UiTable.Body>
    </UiTable>
  );
};

export default RowsTable;
