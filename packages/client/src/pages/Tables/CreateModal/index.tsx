import { FC, useCallback, useMemo } from 'react';
import { Form, Message } from 'semantic-ui-react';
import { BindingAction } from '../../../models/functions';
import ModifyModal from '../../../components/ModifyModal';
import { CreateTableDto } from '../../../dtos';
import { useFormState } from '../../../hooks/useFormState';
import { useAddTableMutation } from '../../../redux/queries/tables';
import { useAppSelector } from '../../../redux/hooks/app/useAppSelector';
import { selectActiveDatabaseId } from '../../../redux/selectors/application';

interface DatabaseCreateModalProps {
  onClose: BindingAction;
}

const TableCreateModal: FC<DatabaseCreateModalProps> = ({ onClose }) => {
  const activeDatabaseId = useAppSelector(selectActiveDatabaseId);
  const [createTable, { isLoading: isCreating, error: creationError }] = useAddTableMutation();

  const [tableFormState, handleTableFormChange] = useFormState<CreateTableDto>({
    name: '',
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

  const tableForm = useMemo(() => {
    const createFetchError = creationError as { status: number; data: { message: string } };
    return (
      <Form onSubmit={handleSaveTable} loading={isCreating} error={!!createFetchError}>
        <Form.Input
          name="name"
          label="Name"
          placeholder="Enter a table name"
          required
          value={tableFormState.name}
          onChange={handleTableFormChange as any}
        />
        <Message error header={createFetchError?.status || ''} content={createFetchError?.data?.message || ''} />
      </Form>
    );
  }, [creationError, handleSaveTable, isCreating, tableFormState.name, handleTableFormChange]);

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
