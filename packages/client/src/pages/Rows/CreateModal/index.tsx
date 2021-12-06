import { FC, useCallback, useMemo } from 'react';
import { Form, Input, Label, Message, Image, Segment, Icon } from 'semantic-ui-react';
import { BindingAction } from '../../../models/functions';
import ModifyModal from '../../../components/ModifyModal';
import { CreateRowDto } from '../../../dtos';
import { useFormState } from '../../../hooks/useFormState';
import { useActiveTable } from '../../../redux/hooks/tables';
import { useAddRowMutation } from '../../../redux/queries/rows';
import { FieldType, RowColumnsValuesIndex } from '../../../models/dbms';
import styles from './styles.module.scss';
import { toFetchError } from '../../../utils/errors';
import { useAppSelector } from '../../../redux/hooks/app/useAppSelector';
import { selectActiveTableColumnsOrderIndex } from '../../../redux/selectors/tables';
import { fileToBase64 } from '../../../utils/files';

interface RowsCreateModalProps {
  onClose: BindingAction;
}

const RowsCreateModal: FC<RowsCreateModalProps> = ({ onClose }) => {
  const { data: activeTable } = useActiveTable();
  const columnsOrderIndex = useAppSelector(selectActiveTableColumnsOrderIndex);

  const [createRow, { isLoading: isCreating, error: creationError }] = useAddRowMutation();

  // columnId -> value records
  const [rowFormState, handleRowFormChange] = useFormState<Record<string, any>>({});

  // TODO Remove duplication
  const handleSaveRow = useCallback(() => {
    if (!activeTable) return;

    const tableColumnsIndex = activeTable.columnsIndex;
    const columnsValuesIndex = Object.entries(rowFormState).reduce((columnsIndex, [columnId, value]) => {
      const column = tableColumnsIndex[columnId];
      const columnType = column.type;
      const columnValue = columnType === FieldType.picture ? value.fileBase64 : value;

      columnsIndex[columnId] = {
        columnId,
        value: columnValue,
      };
      return columnsIndex;
    }, {} as RowColumnsValuesIndex);

    const creationRow: CreateRowDto = { columnsValuesIndex };
    createRow({ databaseId: activeTable.databaseId, tableId: activeTable.id, row: creationRow })
      .unwrap()
      .then(() => onClose());
  }, [activeTable, createRow, onClose, rowFormState]);

  const handlePictureLoading = useCallback(
    async (columnId, fileEvent) => {
      const file = fileEvent.target?.files?.[0];
      const isFileImage = file?.type?.split('/')?.[0] === 'image';
      if (!isFileImage) return;

      const filename = file.name;
      const fileBase64 = await fileToBase64(file);

      const columnValue = {
        filename,
        fileBase64,
      };

      const handler = handleRowFormChange as any;
      handler(fileEvent, { name: columnId, value: columnValue });
    },
    [handleRowFormChange]
  );

  const rowForm = useMemo(() => {
    const creationFetchError = toFetchError(creationError);
    return (
      <Form onSubmit={handleSaveRow} loading={isCreating} error={!!creationFetchError}>
        {activeTable &&
          columnsOrderIndex?.map((columnId) => {
            const column = activeTable.columnsIndex[columnId];
            const label = (
              <span className={styles.RowsCreateModal__FieldLabel}>
                {column.name}
                <Label circular color="black">
                  {column.type}
                </Label>
              </span>
            );

            const value = rowFormState[columnId] || '';
            const handler = handleRowFormChange as any;

            const columnType = column.type;
            if (columnType === FieldType.color) {
              return (
                <Form.Field key={columnId} name={columnId}>
                  <label htmlFor={`${columnId}-color-input`}>{label}</label>
                  <Form.Group inline>
                    <Input name={columnId} value={value} onChange={handler} />
                    <Input
                      id={`${columnId}-color-input`}
                      type="color"
                      name={columnId}
                      value={value}
                      onChange={handler}
                      className={styles.RowsCreateModal__FieldColor}
                    />
                  </Form.Group>
                </Form.Field>
              );
            }

            if (columnType === FieldType.picture) {
              return (
                <Form.Field key={columnId} name={columnId}>
                  <label htmlFor={`${columnId}-picture-input`}>{label}</label>
                  <Form.Group widths="equal" className={styles.RowsCreateModal__FieldPicture}>
                    <Input
                      id={`${columnId}-picture-input`}
                      hidden
                      placeholder="No image has been loaded yet"
                      value={rowFormState[columnId]?.filename}
                      name={columnId}
                      className={styles.RowsCreateModal__FieldPicture__Preview}
                    />
                    <Form.Button as="label" htmlFor={`${columnId}-picture-input-file`} type="button">
                      Click here to load an image
                      <Icon name="picture" />
                    </Form.Button>
                    <input
                      id={`${columnId}-picture-input-file`}
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(event) => handlePictureLoading(columnId, event)}
                    />
                  </Form.Group>
                  {rowFormState[columnId]?.fileBase64 && (
                    <Image src={rowFormState[columnId]?.fileBase64} size="medium" rounded />
                  )}
                </Form.Field>
              );
            }

            if (columnType === FieldType.integer || columnType === FieldType.real) {
              return (
                <Form.Input
                  key={columnId}
                  name={columnId}
                  label={label}
                  type="number"
                  required
                  value={value}
                  onChange={(event, data) => {
                    handler(event, { ...data, value: Number(data.value) });
                  }}
                />
              );
            }

            return (
              <Form.Input key={columnId} name={columnId} label={label} required value={value} onChange={handler} />
            );
          })}
        <Message error header={creationFetchError?.status || ''} content={creationFetchError?.message || ''} />
      </Form>
    );
  }, [
    activeTable,
    columnsOrderIndex,
    creationError,
    handlePictureLoading,
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
