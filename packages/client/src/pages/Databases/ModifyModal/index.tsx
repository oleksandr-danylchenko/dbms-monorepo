import { ChangeEvent, FC, useMemo, useState } from 'react';
import { Form } from 'semantic-ui-react';
import { BindingAction } from '../../../models/functions';
import { useAppSelector } from '../../../redux/hooks/app/useAppSelector';
import { selectDatabaseById } from '../../../redux/selectors/databases';
import ModifyModal from '../../../components/ModifyModal';
import { useUpdateDatabaseMutation } from '../../../redux/queries/databases';
import { UpdateDatabaseDto } from '../../../dtos';

interface DatabaseModifyModalProps {
  databaseId: string;
  onClose: BindingAction;
}

const DatabaseModifyModal: FC<DatabaseModifyModalProps> = ({ databaseId, onClose }) => {
  const modifyingDatabase = useAppSelector((state) => selectDatabaseById(state, databaseId));
  const [updateDatabase, { isLoading: isUpdateLoading, error: updateError }] = useUpdateDatabaseMutation();

  const [databaseFormState, setDatabaseFormState] = useState<UpdateDatabaseDto>({
    name: modifyingDatabase?.name || '',
  });
  const handleFormChange = (
    _: ChangeEvent<HTMLInputElement>,
    { name, value }: { name: keyof UpdateDatabaseDto; value: string }
  ): void => {
    setDatabaseFormState({ [name]: value });
  };

  const handleSaveDatabase = (): void => {
    const updatedDatabase: UpdateDatabaseDto = {
      ...databaseFormState,
    };
    updateDatabase({ databaseId, database: updatedDatabase })
      .unwrap()
      .then(() => onClose());
  };

  const databaseForm = useMemo(() => {
    return (
      <Form loading={isUpdateLoading}>
        <Form.Input
          name="name"
          label="Name"
          placeholder="Enter database name"
          required
          value={databaseFormState.name}
          onChange={handleFormChange as any}
        />
      </Form>
    );
  }, [databaseFormState.name, isUpdateLoading]);

  return (
    <ModifyModal
      open={!!modifyingDatabase}
      header={`Modifying database ${modifyingDatabase?.name}`}
      content={databaseForm}
      size="tiny"
      isLoading={isUpdateLoading}
      onClose={onClose}
      onSave={handleSaveDatabase}
    />
  );
};

export default DatabaseModifyModal;
