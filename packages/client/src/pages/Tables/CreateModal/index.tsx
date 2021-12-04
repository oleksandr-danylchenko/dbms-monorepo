import { FC, useMemo } from 'react';
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
  const [createTable, { isLoading: isCreationLoading, error: creationError }] = useAddTableMutation();

  const [tableFormState, handleTableFormChange] = useFormState<CreateTableDto>({
    name: '',
  });

  // TODO Remove duplication
  const handleSaveDatabase = (): void => {
    if (!activeDatabaseId) return;

    const creationTable: CreateTableDto = {
      ...tableFormState,
    };

    createTable({ databaseId: activeDatabaseId, table: creationTable })
      .unwrap()
      .then(() => onClose());
  };

  const tableForm = useMemo(() => {
    const createFetchError = creationError as { status: number; data: { message: string } };
    return (
      <Form loading={isCreationLoading} error={!!createFetchError}>
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
  }, [tableFormState.name, handleTableFormChange, isCreationLoading, creationError]);

  return (
    <ModifyModal
      open
      header="Create table"
      content={tableForm}
      size="tiny"
      isLoading={isCreationLoading}
      onClose={onClose}
      onSave={handleSaveDatabase}
    />
  );
};

export default TableCreateModal;
