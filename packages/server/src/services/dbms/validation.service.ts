import { FieldType } from '@interfaces/dbms/dbms.interface';

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
}

export default DbmsValidation;
