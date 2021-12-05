import { FC, useCallback, useMemo } from 'react';
import { Form, Message } from 'semantic-ui-react';
import { BindingAction } from '../../../models/functions';
import ModifyModal from '../../../components/ModifyModal';
import { CreateTableDto } from '../../../dtos';
import { useFormState } from '../../../hooks/useFormState';
import { useAddTableMutation } from '../../../redux/queries/tables';
import { useAppSelector } from '../../../redux/hooks/app/useAppSelector';
import { selectActiveDatabaseId } from '../../../redux/selectors/application';
import { toFetchError } from '../../../utils/errors';

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
        <Message error header={creationFetchError?.status || ''} content={creationFetchError?.message || ''} />
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
