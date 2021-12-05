import { FC, useCallback, useMemo } from 'react';
import { Form, Label, Message } from 'semantic-ui-react';
import { BindingAction } from '../../../models/functions';
import ModifyModal from '../../../components/ModifyModal';
import { CreateRowDto } from '../../../dtos';
import { useFormState } from '../../../hooks/useFormState';
import { useActiveTable } from '../../../redux/hooks/tables';
import { useAddRowMutation } from '../../../redux/queries/rows';
import { RowColumnsValuesIndex } from '../../../models/dbms';
import styles from './styles.module.scss';

interface RowsCreateModalProps {
  onClose: BindingAction;
}

const RowsCreateModal: FC<RowsCreateModalProps> = ({ onClose }) => {
  const { data: activeTable } = useActiveTable();

  const [createRow, { isLoading: isCreating, error: creationError }] = useAddRowMutation();

  // columnId -> value records
  const [rowFormState, handleRowFormChange] = useFormState<Record<string, any>>({});

  // TODO Remove duplication
  const handleSaveRow = useCallback(() => {
    if (!activeTable) return;

    const columnsValuesIndex = Object.entries(rowFormState).reduce((columnsIndex, [columnId, value]) => {
      columnsIndex[columnId] = {
        columnId,
        value,
      };
      return columnsIndex;
    }, {} as RowColumnsValuesIndex);

    const creationRow: CreateRowDto = { columnsValuesIndex };
    createRow({ databaseId: activeTable.databaseId, tableId: activeTable.id, row: creationRow })
      .unwrap()
      .then(() => onClose());
  }, [activeTable, createRow, onClose, rowFormState]);

  const rowForm = useMemo(() => {
    const creationFetchError = creationError as { status: number; data: { message: string } };
    return (
      <Form onSubmit={handleSaveRow} loading={isCreating} error={!!creationFetchError}>
        {activeTable?.columnsOrderIndex?.map((columnId) => {
          const column = activeTable.columnsIndex[columnId];
          const label = (
            <span className={styles.RowsCreateModal__FieldLabel}>
              {column.name}
              <Label circular color="black">
                {column.type}
              </Label>
            </span>
          );

          return (
            <Form.Input
              name={columnId}
              label={label}
              required
              value={rowFormState[columnId]}
              onChange={handleRowFormChange as any}
            />
          );
        })}
        <Message error header={creationFetchError?.status || ''} content={creationFetchError?.data?.message || ''} />
      </Form>
    );
  }, [
    activeTable?.columnsIndex,
    activeTable?.columnsOrderIndex,
    creationError,
    handleRowFormChange,
    handleSaveRow,
    isCreating,
    rowFormState,
  ]);

  return (
    <ModifyModal
      open
      header="Create a row"
      content={rowForm}
      size="tiny"
      isLoading={isCreating}
      onClose={onClose}
      onSave={handleSaveRow}
    />
  );
};

export default RowsCreateModal;
