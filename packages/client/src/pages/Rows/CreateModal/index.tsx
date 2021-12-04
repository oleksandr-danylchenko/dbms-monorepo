import { FC, useCallback, useMemo } from 'react';
import { Form, Message } from 'semantic-ui-react';
import { BindingAction } from '../../../models/functions';
import ModifyModal from '../../../components/ModifyModal';
import { CreateRowDto } from '../../../dtos';
import { useFormState } from '../../../hooks/useFormState';
import { useActiveTable } from '../../../redux/hooks/tables';
import { useAddRowMutation } from '../../../redux/queries/rows';

interface RowsCreateModalProps {
  onClose: BindingAction;
}

const RowsCreateModal: FC<RowsCreateModalProps> = ({ onClose }) => {
  const { data: activeTable } = useActiveTable();

  const [createRow, { isLoading: isCreating, error: creationError }] = useAddRowMutation();

  const [rowFormState, handleTableFormChange] = useFormState<Record<string, any>>({});

  // TODO Remove duplication
  const handleSaveRow = useCallback(() => {
    if (!activeTable) return;

    const creationRow: CreateRowDto = {
      columnsValuesIndex: {},
    };

    createRow({ databaseId: activeTable.databaseId, tableId: activeTable.id, row: creationRow })
      .unwrap()
      .then(() => onClose());
  }, [activeTable, createRow, onClose]);

  const tableForm = useMemo(() => {
    const createFetchError = creationError as { status: number; data: { message: string } };
    return (
      <Form onSubmit={handleSaveRow} loading={isCreating} error={!!createFetchError}>
        <Message error header={createFetchError?.status || ''} content={createFetchError?.data?.message || ''} />
      </Form>
    );
  }, [creationError, handleSaveRow, isCreating]);

  return (
    <ModifyModal
      open
      header="Create table"
      content={tableForm}
      size="tiny"
      isLoading={isCreating}
      onClose={onClose}
      onSave={handleSaveRow}
    />
  );
};

export default RowsCreateModal;
