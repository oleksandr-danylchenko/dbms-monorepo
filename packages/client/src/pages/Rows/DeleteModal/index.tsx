import { FC } from 'react';
import { BindingAction } from '../../../models/functions';
import { useAppSelector } from '../../../redux/hooks/app/useAppSelector';
import DeleteModal from '../../../components/DeleteModal';
import { selectActiveDatabaseId, selectActiveTableId } from '../../../redux/selectors/application';
import { useDeleteRowMutation } from '../../../redux/queries/rows';

interface RowDeleteModalProps {
  rowId: string;
  onClose: BindingAction;
}

const RowDeleteModal: FC<RowDeleteModalProps> = ({ rowId, onClose }) => {
  const activeDatabaseId = useAppSelector(selectActiveDatabaseId);
  const activeTableId = useAppSelector(selectActiveTableId);
  const [deleteRow] = useDeleteRowMutation();

  const handleDeleteTable = (): void => {
    if (!activeDatabaseId || !activeTableId) return;

    deleteRow({ rowId, databaseId: activeDatabaseId, tableId: activeTableId });
    onClose();
  };

  return (
    <DeleteModal
      open={!!activeDatabaseId && !!activeTableId && !!rowId}
      header={`Do you want to delete row ${rowId}?`}
      onClose={onClose}
      onDelete={handleDeleteTable}
    />
  );
};

export default RowDeleteModal;
