import { FC, useCallback, useMemo, useState } from 'react';
import { Button, Form, Icon, Label, Menu, Message } from 'semantic-ui-react';
import { BindingAction } from '../../../models/functions';
import ModifyModal from '../../../components/ModifyModal';
import { CreateColumnDto, CreateTableDto } from '../../../dtos';
import { useFormState } from '../../../hooks/useFormState';
import { useAddTableMutation } from '../../../redux/queries/tables';
import { useAppSelector } from '../../../redux/hooks/app/useAppSelector';
import { selectActiveDatabaseId } from '../../../redux/selectors/application';
import { toFetchError } from '../../../utils/errors';
import { FieldType } from '../../../models/dbms';

interface DatabaseCreateModalProps {
  onClose: BindingAction;
}

const defaultColumnFormState = {
  name: '',
  type: undefined,
  orderIndex: undefined,
};

const fieldsTypesOptions = Object.values(FieldType).map((type) => ({ key: type, value: type, text: type }));

const TableCreateModal: FC<DatabaseCreateModalProps> = ({ onClose }) => {
  const activeDatabaseId = useAppSelector(selectActiveDatabaseId);
  const [createTable, { isLoading: isCreating, error: creationError }] = useAddTableMutation();

  const [isAddingColumn, setAddingColumn] = useState(false);
  const [editingColumn, handleColumnChange, setColumnState] =
    useFormState<Partial<CreateColumnDto>>(defaultColumnFormState);

  const [tableFormState, handleTableFormChange, setTableFormState] = useFormState<CreateTableDto>({
    name: '',
    columns: [],
  });

  // TODO Remove duplication
  const handleSaveTable = useCallback(() => {
    if (!activeDatabaseId) return;

    const creationTable: CreateTableDto = {
      ...tableFormState,
    };

    createTable({ databaseId: activeDatabaseId, table: creationTable })
      .unwrap()
      .then(() => onClose());
  }, [activeDatabaseId, createTable, onClose, tableFormState]);

  const handleAddColumn = useCallback(() => {
    setAddingColumn(true);
    setColumnState(defaultColumnFormState);
  }, [setColumnState]);

  const handleSaveNewColumn = useCallback(() => {
    setTableFormState((prevTableState) => {
      const previousColumns = prevTableState.columns;
      const newColumnOrderIndex = previousColumns.length + 1;
      const newColumnData = { ...(editingColumn as CreateColumnDto), orderIndex: newColumnOrderIndex };
      const columnsWithNew = [...previousColumns, newColumnData];
      return {
        ...prevTableState,
        columns: columnsWithNew,
      };
    });
    setAddingColumn(false);
  }, [editingColumn, setTableFormState]);

  const handleRemoveNewColumn = useCallback(() => {
    setColumnState(defaultColumnFormState);
    setAddingColumn(false);
  }, [setColumnState]);

  const tableForm = useMemo(() => {
    const creationFetchError = toFetchError(creationError);
    return (
      <Form onSubmit={handleSaveTable} loading={isCreating} error={!!creationFetchError}>
        <Form.Input
          name="name"
          label="Name"
          placeholder="Enter a table name"
          required
          value={tableFormState.name}
          onChange={handleTableFormChange as any}
        />
        <Menu vertical fluid>
          {tableFormState.columns.map((column) => {
            const { name: columnName, type: columnType } = column;
            return (
              <Menu.Item key={columnName}>
                <span>{columnName}</span>
                <Label circular color="black">
                  {columnType}
                </Label>
              </Menu.Item>
            );
          })}
          {isAddingColumn && (
            <Menu.Item key="creatingColumn">
              <Form.Group>
                <Form.Input
                  name="name"
                  placeholder="Column name"
                  value={editingColumn?.name || ''}
                  onChange={handleColumnChange as any}
                />
                <Form.Dropdown
                  fluid
                  search
                  selection
                  name="type"
                  placeholder="Column type"
                  value={editingColumn?.type || ''}
                  options={fieldsTypesOptions}
                  onChange={handleColumnChange as any}
                />
                <Form.Button icon="times" size="mini" basic onClick={handleRemoveNewColumn} />
                <Form.Button icon="plus circle" size="mini" color="black" onClick={handleSaveNewColumn} />
              </Form.Group>
            </Menu.Item>
          )}
          {!isAddingColumn && (
            <Menu.Item key="createColumn">
              <Button type="button" icon labelPosition="left" size="mini" fluid onClick={handleAddColumn}>
                Add a column
                <Icon name="plus circle" />
              </Button>
            </Menu.Item>
          )}
        </Menu>
        <Message error header={creationFetchError?.status || ''} content={creationFetchError?.message || ''} />
      </Form>
    );
  }, [
    creationError,
    editingColumn?.name,
    editingColumn?.type,
    handleAddColumn,
    handleColumnChange,
    handleSaveTable,
    handleTableFormChange,
    isAddingColumn,
    isCreating,
    tableFormState.columns,
    tableFormState.name,
  ]);

  return (
    <ModifyModal
      open
      header="Create table"
      content={tableForm}
      size="tiny"
      isLoading={isCreating}
      onClose={onClose}
      onSave={handleSaveTable}
    />
  );
};

export default TableCreateModal;
