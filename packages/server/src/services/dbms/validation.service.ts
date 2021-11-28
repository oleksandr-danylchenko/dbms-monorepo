import { FieldType } from '@interfaces/dbms/dbms.interface';
import { ColumnsIndex } from '@models/dbms/table';
import { RowColumnsValuesIndex } from '@models/dbms/row';

export type Validator = (value: unknown) => boolean;

export type TypeValidationIndex = {
  [type in FieldType]: Validator;
};

class DbmsValidation {
  private static readonly _typeValidationIndex: TypeValidationIndex = {
    integer: (value) => Number.isSafeInteger(value),
    real: (value) => Number.isFinite(value),
    char: (value) => typeof value === 'string' && value.length === 1,
    string: (value) => typeof value === 'string',
    picture: () => true,
    color: () => true,
  };

  public static getValidatorByType(type: FieldType): Validator {
    return this._typeValidationIndex[type];
  }

  public static validateRowValues(
    columnsIndex: ColumnsIndex,
    rowColumnsValuesIndex: RowColumnsValuesIndex
  ): { errorMessage: string | null } {
    const columns = Object.values(columnsIndex);
    const missingRowColumns = columns.filter(({ id: columnId }) => !rowColumnsValuesIndex[columnId]);
    if (missingRowColumns.length > 0) {
      const columnsNames = missingRowColumns.map(({ id, name }) => `(${id}:${name})`).join(', ');
      return { errorMessage: `Row column missing [${columnsNames}] columns` };
    }

    for (const columnId in rowColumnsValuesIndex) {
      if (!(columnId in columnsIndex)) {
        return { errorMessage: `Column ${columnId} is not presented for the table` };
      }

      const column = columnsIndex[columnId];
      const rowColumnValue = rowColumnsValuesIndex[columnId].value;

      const isValueValid = column.validate(rowColumnValue);
      if (!isValueValid) {
        const { name, type } = column;
        return {
          errorMessage: `Value ${rowColumnValue} doesn't satisfy type ${type} constraints for the column ${name}`,
        };
      }
    }

    return { errorMessage: null };
  }
}

export default DbmsValidation;
