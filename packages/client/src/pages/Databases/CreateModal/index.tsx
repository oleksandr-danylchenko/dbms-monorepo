import { FC, useCallback, useMemo } from 'react';
import { Form, Message } from 'semantic-ui-react';
import { BindingAction } from '../../../models/functions';
import ModifyModal from '../../../components/ModifyModal';
import { useAddDatabaseMutation } from '../../../redux/queries/databases';
import { CreateDatabaseDto } from '../../../dtos';
import { useFormState } from '../../../hooks/useFormState';
import { toFetchError } from '../../../utils/errors';

interface DatabaseCreateModalProps {
  onClose: BindingAction;
}

const DatabaseCreateModal: FC<DatabaseCreateModalProps> = ({ onClose }) => {
  const [createDatabase, { isLoading: isCreating, error: creationError }] = useAddDatabaseMutation();

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
    const creationFetchError = toFetchError(creationError);
    return (
      <Form onSubmit={handleSaveDatabase} loading={isCreating} error={!!creationFetchError}>
        <Form.Input
          name="name"
          label="Name"
          placeholder="Enter a database name"
          required
          value={databaseFormState.name}
          onChange={handleDatabaseFormChange as any}
        />
        <Message error header={creationFetchError?.status || ''} content={creationFetchError?.message || ''} />
      </Form>
    );
  }, [creationError, handleSaveDatabase, isCreating, databaseFormState.name, handleDatabaseFormChange]);

  return (
    <ModifyModal
      open
      header="Create database"
      content={databaseForm}
      size="tiny"
      isLoading={isCreating}
      onClose={onClose}
      onSave={handleSaveDatabase}
    />
  );
};

export default DatabaseCreateModal;
