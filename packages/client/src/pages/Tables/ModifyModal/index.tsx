import { FC, useCallback, useMemo, useState } from 'react';
import { Button, Form, Icon, Label, Menu, Message } from 'semantic-ui-react';
import { BindingAction } from '../../../models/functions';
import { useAppSelector } from '../../../redux/hooks/app/useAppSelector';
import ModifyModal from '../../../components/ModifyModal';
import { CreateColumnDto, UpdateColumnDto, UpdateTableDto } from '../../../dtos';
import { useFormState } from '../../../hooks/useFormState';
import { selectTableById } from '../../../redux/selectors/tables';
import { useUpdateTableMutation } from '../../../redux/queries/tables';
import { toFetchError } from '../../../utils/errors';
import { defaultColumnFormState, fieldsTypesOptions } from '../CreateModal';
import { moveArray } from '../../../utils/objects';

interface TableModifyModalProps {
  tableId: string;
  onClose: BindingAction;
}

const TableModifyModal: FC<TableModifyModalProps> = ({ tableId, onClose }) => {
  const modifyingTable = useAppSelector((state) => selectTableById(state, tableId));
  const [updateTable, { isLoading: isUpdateLoading, error: updateError }] = useUpdateTableMutation();

  const [isAddingColumn, setAddingColumn] = useState(false);
  const [editingColumnName, setEditingColumnName] = useState<string>();
  const [modifyingColumn, handleColumnChange, setColumnState] =
    useFormState<Partial<UpdateColumnDto>>(defaultColumnFormState);

  const [tableFormState, handleTableFormChange, setTableFormState] = useFormState<UpdateTableDto>({
    name: modifyingTable?.name || '',
    columns: Object.values(modifyingTable?.columnsIndex || {}),
  });

  // TODO Remove duplication
  const handleSaveTable = useCallback(() => {
    if (!modifyingTable?.databaseId) return;

    const updatedTable: UpdateTableDto = {
      name: tableFormState.name,
      columns: tableFormState.columns.map((column) => ({
        id: column.id,
        name: column.name,
        type: column.type,
        orderIndex: column.orderIndex,
      })),
    };

    updateTable({ databaseId: modifyingTable.databaseId, tableId, table: updatedTable })
      .unwrap()
      .then(() => onClose());
  }, [modifyingTable?.databaseId, onClose, tableFormState, tableId, updateTable]);

  const handleAddColumn = useCallback(() => {
    setAddingColumn(true);
    setColumnState(defaultColumnFormState);
  }, [setColumnState]);

  const handleRemoveNewColumn = useCallback(() => {
    setColumnState(defaultColumnFormState);
    setAddingColumn(false);
  }, [setColumnState]);

  const handleSaveNewColumn = useCallback(() => {
    const newColumn = modifyingColumn as UpdateColumnDto;
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
    const editingColumn = modifyingColumn as UpdateColumnDto;
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
    const updateFetchError = toFetchError(updateError);
    return (
      <Form onSubmit={handleSaveTable} loading={isUpdateLoading} error={!!updateFetchError}>
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
        <Message error header={updateFetchError?.status || ''} content={updateFetchError?.message || ''} />
      </Form>
    );
  }, [
    updateError,
    handleSaveTable,
    isUpdateLoading,
    tableFormState.name,
    tableFormState.columns,
    handleTableFormChange,
    isAddingColumn,
    editingColumnName,
    modifyingColumn?.name,
    modifyingColumn?.type,
    handleColumnChange,
    handleRemoveNewColumn,
    handleSaveNewColumn,
    handleAddColumn,
    handleRemoveEditingColumn,
    handleSaveEditingColumn,
    handleRemoveColumn,
    handleEditColumn,
    handleMoveColumn,
  ]);

  if (!modifyingTable) {
    onClose();
  }

  return (
    <ModifyModal
      open
      header={`Modify table ${modifyingTable?.name}`}
      content={tableForm}
      size="tiny"
      isLoading={isUpdateLoading}
      onClose={onClose}
      onSave={handleSaveTable}
    />
  );
};

export default TableModifyModal;
