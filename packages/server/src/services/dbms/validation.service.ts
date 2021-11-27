import { FieldType } from '@interfaces/dbms/dbms.interface';

export type Validator = <T = unknown>(value: T) => boolean;

export type TypeValidationIndex = {
  [type in FieldType]: Validator;
};

class DbmsValidation {
  private static readonly _typeValidationIndex: TypeValidationIndex = {
    integer: () => true,
    real: () => true,
    char: () => true,
    string: () => true,
    picture: () => true,
    color: () => true,
  };

  public static getValidatorByType(type: FieldType): Validator {
    return this._typeValidationIndex[type];
  }
}

export default DbmsValidation;
