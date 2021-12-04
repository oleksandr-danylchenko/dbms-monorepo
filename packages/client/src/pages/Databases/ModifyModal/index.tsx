import { FC, useMemo } from 'react';
import { Form, Message } from 'semantic-ui-react';
import { BindingAction } from '../../../models/functions';
import { useAppSelector } from '../../../redux/hooks/app/useAppSelector';
import { selectDatabaseById } from '../../../redux/selectors/databases';
import ModifyModal from '../../../components/ModifyModal';
import { useUpdateDatabaseMutation } from '../../../redux/queries/databases';
import { UpdateDatabaseDto } from '../../../dtos';
import { useFormState } from '../../../hooks/useFormState';

interface DatabaseModifyModalProps {
  databaseId: string;
  onClose: BindingAction;
}

const DatabaseModifyModal: FC<DatabaseModifyModalProps> = ({ databaseId, onClose }) => {
  const modifyingDatabase = useAppSelector((state) => selectDatabaseById(state, databaseId));
  const [updateDatabase, { isLoading: isUpdateLoading, error: updateError }] = useUpdateDatabaseMutation();

  const [databaseFormState, handleDatabaseFormChange] = useFormState<UpdateDatabaseDto>({
    name: modifyingDatabase?.name || '',
  });

  // TODO Remove duplication
  const handleSaveDatabase = (): void => {
    const updatedDatabase: UpdateDatabaseDto = {
      ...databaseFormState,
    };

    // Ignore if nothing has changed
    if (updatedDatabase.name === modifyingDatabase?.name) {
      onClose();
      return;
    }

    updateDatabase({ databaseId, database: updatedDatabase })
      .unwrap()
      .then(() => onClose());
  };

  const databaseForm = useMemo(() => {
    const updateFetchError = updateError as { status: number; data: { message: string } };
    return (
      <Form loading={isUpdateLoading} error={!!updateFetchError}>
        <Form.Input
          name="name"
          label="Name"
          placeholder="Enter a database name"
          required
          value={databaseFormState.name}
          onChange={handleDatabaseFormChange as any}
        />
        <Message error header={updateFetchError?.status || ''} content={updateFetchError?.data?.message || ''} />
      </Form>
    );
  }, [databaseFormState.name, handleDatabaseFormChange, isUpdateLoading, updateError]);

  if (!modifyingDatabase) {
    onClose();
  }

  return (
    <ModifyModal
      open
      header={`Modify database ${modifyingDatabase?.name}`}
      content={databaseForm}
      size="tiny"
      isLoading={isUpdateLoading}
      onClose={onClose}
      onSave={handleSaveDatabase}
    />
  );
};

export default DatabaseModifyModal;
