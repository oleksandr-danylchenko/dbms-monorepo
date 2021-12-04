import { FC, ReactElement, useMemo } from 'react';
import { Container, Label, Placeholder, Table as UiTable } from 'semantic-ui-react';
import { useAppSelector } from '../../../redux/hooks/app/useAppSelector';
import { useActiveTable } from '../../../redux/hooks/tables';
import { toFetchError } from '../../../utils/errors';
import ErrorHeader from '../../../components/ErrorHeader';
import { useActiveTableRows } from '../../../redux/hooks/rows';
import { selectAllRows } from '../../../redux/selectors/rows';
import styles from './styles.module.scss';
import { FieldType } from '../../../models/dbms';

const RowsTable: FC = () => {
  const { data: activeTable, isFetching: isActiveTableFetching, error: activeTableError } = useActiveTable();

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

  if (isActiveTableFetching || isLoading) {
    return tablePlaceholderElement;
  }

  if (activeTableError || rowsError) {
    const sharedError = activeTableError || rowsError;
    const fetchingError = toFetchError(sharedError);
    return <ErrorHeader message={fetchingError.message} submessage={fetchingError.status} />;
  }

  const formatCellValue = ({ type, value }: { type: FieldType; value: string }): string | ReactElement => {
    if (type === FieldType.color) {
      return (
        <span className={styles.RowsTable__ColorCell}>
          {value} <span style={{ backgroundColor: value }} />
        </span>
      );
    }

    return value;
  };

  return (
    <UiTable celled>
      <UiTable.Header>
        <UiTable.Row>
          {activeTable?.columnsOrderIndex?.map((columnId) => {
            const { name: columnName, type: columnType } = activeTable.columnsIndex[columnId];
            return (
              <UiTable.HeaderCell key={columnId}>
                <div className={styles.RowsTable__HeaderCell}>
                  {columnName}
                  <Label circular color="grey">
                    {columnType}
                  </Label>
                </div>
              </UiTable.HeaderCell>
            );
          })}
        </UiTable.Row>
      </UiTable.Header>
      <UiTable.Body>
        {rows.map((row) => (
          <UiTable.Row key={row.id}>
            {activeTable?.columnsOrderIndex?.map((columnId) => {
              const { type: columnType } = activeTable.columnsIndex[columnId];
              const { value: columnValue } = row.columnsValuesIndex[columnId];
              return (
                <UiTable.Cell key={columnId}>{formatCellValue({ type: columnType, value: columnValue })}</UiTable.Cell>
              );
            })}
          </UiTable.Row>
        ))}
      </UiTable.Body>
    </UiTable>
  );
};

export default RowsTable;
