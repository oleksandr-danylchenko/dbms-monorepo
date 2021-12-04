import { FC } from 'react';
import { BindingAction } from '../../../models/functions';
import { useAppSelector } from '../../../redux/hooks/app/useAppSelector';
import DeleteModal from '../../../components/DeleteModal';
import { selectActiveDatabaseId } from '../../../redux/selectors/application';
import { useDeleteTableMutation } from '../../../redux/queries/tables';
import { selectTableById } from '../../../redux/selectors/tables';

interface TableDeleteModalProps {
  tableId: string;
  onClose: BindingAction;
}

const TableDeleteModal: FC<TableDeleteModalProps> = ({ tableId, onClose }) => {
  const activeDatabaseId = useAppSelector(selectActiveDatabaseId);
  const deletingTable = useAppSelector((state) => selectTableById(state, tableId));
  const [deleteTable] = useDeleteTableMutation();

  const handleDeleteTable = (): void => {
    if (!activeDatabaseId || !deletingTable?.id) return;

    deleteTable({ databaseId: activeDatabaseId, tableId });
    onClose();
  };

  return (
    <DeleteModal
      open={!!deletingTable}
      header={`Do you want to delete table ${deletingTable?.name}?`}
      onClose={onClose}
      onDelete={handleDeleteTable}
    />
  );
};

export default TableDeleteModal;
