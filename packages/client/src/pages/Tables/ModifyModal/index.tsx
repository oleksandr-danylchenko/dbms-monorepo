import { FC, useCallback, useMemo } from 'react';
import { Form, Message } from 'semantic-ui-react';
import { BindingAction } from '../../../models/functions';
import { useAppSelector } from '../../../redux/hooks/app/useAppSelector';
import ModifyModal from '../../../components/ModifyModal';
import { UpdateTableDto } from '../../../dtos';
import { useFormState } from '../../../hooks/useFormState';
import { selectTableById } from '../../../redux/selectors/tables';
import { useUpdateTableMutation } from '../../../redux/queries/tables';
import { toFetchError } from '../../../utils/errors';

interface TableModifyModalProps {
  tableId: string;
  onClose: BindingAction;
}

const TableModifyModal: FC<TableModifyModalProps> = ({ tableId, onClose }) => {
  const modifyingTable = useAppSelector((state) => selectTableById(state, tableId));
  const [updateTable, { isLoading: isUpdateLoading, error: updateError }] = useUpdateTableMutation();

  const [tableFormState, handleTableFormChange] = useFormState<UpdateTableDto>({
    name: modifyingTable?.name || '',
    columns: Object.values(modifyingTable?.columnsIndex || {}),
  });

  // TODO Remove duplication
  const handleSaveTable = useCallback(() => {
    if (!modifyingTable?.databaseId) return;

    const updatedTable: UpdateTableDto = {
      ...tableFormState,
    };

    updateTable({ databaseId: modifyingTable.databaseId, tableId, table: updatedTable })
      .unwrap()
      .then(() => onClose());
  }, [modifyingTable?.databaseId, onClose, tableFormState, tableId, updateTable]);

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
        <Message error header={updateFetchError?.status || ''} content={updateFetchError?.message || ''} />
      </Form>
    );
  }, [updateError, handleSaveTable, isUpdateLoading, tableFormState.name, handleTableFormChange]);

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
