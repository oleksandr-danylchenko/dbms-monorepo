import { FC } from 'react';
import { BindingAction } from '../../../models/functions';
import { useAppSelector } from '../../../redux/hooks/app/useAppSelector';
import { selectDatabaseById } from '../../../redux/selectors/databases';
import ModifyModal from '../../../components/ModifyModal';
import { useUpdateDatabaseMutation } from '../../../redux/queries/databases';

interface ModifyModalProps {
  databaseId: string;
  onClose: BindingAction;
}

const DatabaseModifyModal: FC<ModifyModalProps> = ({ databaseId, onClose }) => {
  const modifyingDatabase = useAppSelector((state) => selectDatabaseById(state, databaseId));
  const [updateDatabase] = useUpdateDatabaseMutation();

  const handleSaveDatabase = (): void => {
    console.log('Updating', databaseId);
    // updateDatabase({ databaseId, database: updateDatabaseDto });
  };

  return (
    <ModifyModal
      open={!!modifyingDatabase}
      header={`Modifying database ${modifyingDatabase?.name}`}
      content="HellO!"
      onClose={onClose}
      onSave={handleSaveDatabase}
    />
  );
};

export default DatabaseModifyModal;
