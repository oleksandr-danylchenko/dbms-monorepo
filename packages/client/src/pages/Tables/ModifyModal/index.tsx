import { FC, useMemo } from 'react';
import { Form, Message } from 'semantic-ui-react';
import { BindingAction } from '../../../models/functions';
import { useAppSelector } from '../../../redux/hooks/app/useAppSelector';
import ModifyModal from '../../../components/ModifyModal';
import { UpdateTableDto } from '../../../dtos';
import { useFormState } from '../../../hooks/useFormState';
import { selectTableById } from '../../../redux/selectors/tables';
import { useUpdateTableMutation } from '../../../redux/queries/tables';

interface TableModifyModalProps {
  tableId: string;
  onClose: BindingAction;
}

const TableModifyModal: FC<TableModifyModalProps> = ({ tableId, onClose }) => {
  const modifyingTable = useAppSelector((state) => selectTableById(state, tableId));
  const [updateTable, { isLoading: isUpdateLoading, error: updateError }] = useUpdateTableMutation();

  const [tableFormState, handleTableFormChange] = useFormState<UpdateTableDto>({
    name: modifyingTable?.name || '',
    columnsOrderIndex: modifyingTable?.columnsOrderIndex || [],
  });

  // TODO Remove duplication
  const handleSaveTable = (): void => {
    if (!modifyingTable?.databaseId) return;

    const updatedTable: UpdateTableDto = {
      ...tableFormState,
    };

    updateTable({ databaseId: modifyingTable.databaseId, tableId, table: updatedTable })
      .unwrap()
      .then(() => onClose());
  };

  const tableForm = useMemo(() => {
    const updateFetchError = updateError as { status: number; data: { message: string } };
    return (
      <Form loading={isUpdateLoading} error={!!updateFetchError}>
        <Form.Input
          name="name"
          label="Name"
          placeholder="Enter a table name"
          required
          value={tableFormState.name}
          onChange={handleTableFormChange as any}
        />
        <Message error header={updateFetchError?.status || ''} content={updateFetchError?.data?.message || ''} />
      </Form>
    );
  }, [tableFormState.name, handleTableFormChange, isUpdateLoading, updateError]);

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
