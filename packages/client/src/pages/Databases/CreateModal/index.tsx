import { FC, useCallback, useMemo } from 'react';
import { Form, Message } from 'semantic-ui-react';
import { BindingAction } from '../../../models/functions';
import ModifyModal from '../../../components/ModifyModal';
import { useAddDatabaseMutation } from '../../../redux/queries/databases';
import { CreateDatabaseDto } from '../../../dtos';
import { useFormState } from '../../../hooks/useFormState';

interface DatabaseCreateModalProps {
  onClose: BindingAction;
}

const DatabaseCreateModal: FC<DatabaseCreateModalProps> = ({ onClose }) => {
  const [createDatabase, { isLoading: isCreationLoading, error: creationError }] = useAddDatabaseMutation();

  const [databaseFormState, handleDatabaseFormChange] = useFormState<CreateDatabaseDto>({
    name: '',
  });

  // TODO Remove duplication
  const handleSaveDatabase = useCallback(() => {
    const creationDatabase: CreateDatabaseDto = {
      ...databaseFormState,
    };

    createDatabase({ database: creationDatabase })
      .unwrap()
      .then(() => onClose());
  }, [createDatabase, databaseFormState, onClose]);

  const databaseForm = useMemo(() => {
    const createFetchError = creationError as { status: number; data: { message: string } };
    return (
      <Form onSubmit={handleSaveDatabase} loading={isCreationLoading} error={!!createFetchError}>
        <Form.Input
          name="name"
          label="Name"
          placeholder="Enter a database name"
          required
          value={databaseFormState.name}
          onChange={handleDatabaseFormChange as any}
        />
        <Message error header={createFetchError?.status || ''} content={createFetchError?.data?.message || ''} />
      </Form>
    );
  }, [creationError, handleSaveDatabase, isCreationLoading, databaseFormState.name, handleDatabaseFormChange]);

  return (
    <ModifyModal
      open
      header="Create database"
      content={databaseForm}
      size="tiny"
      isLoading={isCreationLoading}
      onClose={onClose}
      onSave={handleSaveDatabase}
    />
  );
};

export default DatabaseCreateModal;
