import { FC } from 'react';
import { BindingAction } from '../../../models/functions';
import { useAppSelector } from '../../../redux/hooks/app/useAppSelector';
import { selectDatabaseById } from '../../../redux/selectors/databases';
import { useDeleteDatabaseMutation } from '../../../redux/queries/databases';
import DeleteModal from '../../../components/DeleteModal';

interface DatabaseDeleteModalProps {
  databaseId: string;
  onClose: BindingAction;
}

const DatabaseDeleteModal: FC<DatabaseDeleteModalProps> = ({ databaseId, onClose }) => {
  const deletingDatabase = useAppSelector((state) => selectDatabaseById(state, databaseId));
  const [deleteDatabase] = useDeleteDatabaseMutation();

  const handleDeleteDatabase = (): void => {
    if (!deletingDatabase?.id) return;

    deleteDatabase({ databaseId });
    onClose();
  };

  return (
    <DeleteModal
      open={!!deletingDatabase}
      header={`Do you want to delete database ${deletingDatabase?.name}?`}
      onClose={onClose}
      onDelete={handleDeleteDatabase}
    />
  );
};

export default DatabaseDeleteModal;
