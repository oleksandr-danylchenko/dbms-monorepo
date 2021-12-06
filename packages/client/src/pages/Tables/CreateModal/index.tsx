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
import { moveArray } from '../../../utils/objects';

interface DatabaseCreateModalProps {
  onClose: BindingAction;
}

export const defaultColumnFormState = {
  name: '',
  type: undefined,
  orderIndex: undefined,
};

export const fieldsTypesOptions = Object.values(FieldType).map((type) => ({ key: type, value: type, text: type }));

const TableCreateModal: FC<DatabaseCreateModalProps> = ({ onClose }) => {
  const activeDatabaseId = useAppSelector(selectActiveDatabaseId);
  const [createTable, { isLoading: isCreating, error: creationError }] = useAddTableMutation();

  const [isAddingColumn, setAddingColumn] = useState(false);
  const [editingColumnName, setEditingColumnName] = useState<string>();
  const [modifyingColumn, handleColumnChange, setColumnState] =
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

  const handleRemoveNewColumn = useCallback(() => {
    setColumnState(defaultColumnFormState);
    setAddingColumn(false);
  }, [setColumnState]);

  const handleSaveNewColumn = useCallback(() => {
    const newColumn = modifyingColumn as CreateColumnDto;
    const { name: newName, type: newType } = newColumn;
    if (!newName || !newType) return;

    const { columns } = tableFormState;
    const columnsNames = columns.map((column) => column.name);
    if (columnsNames.includes(newName)) return;

    setTableFormState((prevTableState) => {
      const previousColumns = prevTableState.columns;
      const newColumnOrderIndex = previousColumns.length + 1;
      const newColumnData = { ...newColumn, orderIndex: newColumnOrderIndex };
      const columnsWithNew = [...previousColumns, newColumnData];
      return {
        ...prevTableState,
        columns: columnsWithNew,
      };
    });
    handleRemoveNewColumn();
  }, [handleRemoveNewColumn, modifyingColumn, setTableFormState, tableFormState]);

  const handleEditColumn = useCallback(
    (columnName: string) => {
      const prevColumns = tableFormState.columns;
      const prevColumn = prevColumns.find((column) => column.name === columnName);
      if (!prevColumn) return;

      setEditingColumnName(columnName);
      setColumnState(prevColumn);
    },
    [setColumnState, tableFormState.columns]
  );

  const handleRemoveEditingColumn = useCallback(() => {
    setColumnState(defaultColumnFormState);
    setEditingColumnName(undefined);
  }, [setColumnState]);

  const handleSaveEditingColumn = useCallback(() => {
    const editingColumn = modifyingColumn as CreateColumnDto;
    const { name: newName, type: newType } = editingColumn;
    if (!newName || !newType) return;

    const { columns } = tableFormState;
    const columnsNames = columns.map((column) => column.name);
    if (columnsNames.includes(newName) && newName !== editingColumnName) return;

    setTableFormState((prevTableState) => {
      const previousColumns = prevTableState.columns;
      const prevColumnIndex = previousColumns.findIndex((column) => column.name === editingColumnName);
      const updatedColumns = [...previousColumns];
      updatedColumns.splice(prevColumnIndex, 1, editingColumn);
      return {
        ...prevTableState,
        columns: updatedColumns,
      };
    });
    handleRemoveEditingColumn();
  }, [editingColumnName, handleRemoveEditingColumn, modifyingColumn, setTableFormState, tableFormState]);

  const handleRemoveColumn = useCallback(
    (columnName: string) => {
      setTableFormState((prevTableState) => {
        const columnsWithoutName = prevTableState.columns
          .filter((column) => column.name !== columnName)
          .map((column, index) => ({ ...column, orderIndex: index }));
        return {
          ...prevTableState,
          columns: columnsWithoutName,
        };
      });
    },
    [setTableFormState]
  );

  const handleMoveColumn = useCallback(
    (columnName: string, direction: 'up' | 'down') => {
      setTableFormState((prevTableState) => {
        const prevColumns = prevTableState.columns;
        const columnNameIndex = prevColumns.findIndex((column) => column.name === columnName);
        const prevIndex = columnNameIndex - 1;
        const nextIndex = columnNameIndex + 1;
        if (prevIndex < 0 && direction === 'up') {
          return prevTableState;
        }
        if (nextIndex >= prevColumns.length && direction === 'down') {
          return prevTableState;
        }

        const movingIndex = direction === 'up' ? prevIndex : nextIndex;
        const movedArray = moveArray(prevColumns, columnNameIndex, movingIndex);
        const reorderedColumns = movedArray.map((column, index) => ({ ...column, orderIndex: index }));
        return {
          ...prevTableState,
          columns: reorderedColumns,
        };
      });
    },
    [setTableFormState]
  );

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

            if (columnName === editingColumnName) {
              return (
                <Menu.Item key="editingColumn">
                  <Form.Group>
                    <Form.Input
                      name="name"
                      placeholder="Column name"
                      value={modifyingColumn?.name || ''}
                      onChange={handleColumnChange as any}
                    />
                    <Form.Dropdown
                      fluid
                      search
                      selection
                      name="type"
                      placeholder="Column type"
                      value={modifyingColumn?.type || ''}
                      options={fieldsTypesOptions}
                      onChange={handleColumnChange as any}
                    />
                    <Form.Button type="button" icon="times" size="mini" basic onClick={handleRemoveEditingColumn} />
                    <Form.Button
                      type="button"
                      icon="plus circle"
                      size="mini"
                      color="black"
                      onClick={handleSaveEditingColumn}
                    />
                  </Form.Group>
                </Menu.Item>
              );
            }

            return (
              <Menu.Item key={columnName} disabled={!!editingColumnName}>
                <Icon
                  name="trash alternate"
                  disabled={!!editingColumnName}
                  onClick={() => handleRemoveColumn(columnName)}
                />
                <Icon
                  name="pencil alternate"
                  disabled={!!editingColumnName}
                  onClick={() => handleEditColumn(columnName)}
                />
                <Icon
                  name="arrow up"
                  disabled={!!editingColumnName}
                  onClick={() => handleMoveColumn(columnName, 'up')}
                />
                <Icon
                  name="arrow down"
                  disabled={!!editingColumnName}
                  onClick={() => handleMoveColumn(columnName, 'down')}
                />
                <span>{columnName}</span>
                <Label circular color="black">
                  {columnType}
                </Label>
              </Menu.Item>
            );
          })}
          {isAddingColumn && !editingColumnName && (
            <Menu.Item key="creatingColumn">
              <Form.Group>
                <Form.Input
                  name="name"
                  placeholder="Column name"
                  value={modifyingColumn?.name || ''}
                  onChange={handleColumnChange as any}
                />
                <Form.Dropdown
                  fluid
                  search
                  selection
                  name="type"
                  placeholder="Column type"
                  value={modifyingColumn?.type || ''}
                  options={fieldsTypesOptions}
                  onChange={handleColumnChange as any}
                />
                <Form.Button type="button" icon="times" size="mini" basic onClick={handleRemoveNewColumn} />
                <Form.Button type="button" icon="plus circle" size="mini" color="black" onClick={handleSaveNewColumn} />
              </Form.Group>
            </Menu.Item>
          )}
          {!isAddingColumn && !editingColumnName && (
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
    modifyingColumn?.name,
    modifyingColumn?.type,
    creationError,
    handleAddColumn,
    handleColumnChange,
    handleMoveColumn,
    handleRemoveColumn,
    handleRemoveNewColumn,
    handleSaveNewColumn,
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
