import { nanoid } from 'nanoid';
import { FieldType } from '@interfaces/dbms/dbms.interface';
import DbmsValidation, { Validator } from '@services/dbms/validation.service';

class Column {
  private readonly _id: string;
  private _name: string;
  private readonly _tableId: string;
  private _type: FieldType;
  private _validator: Validator;

  constructor({ id, name, tableId, type }: { id?: string; name: string; tableId: string; type: FieldType }) {
    this._id = id || nanoid();
    this._name = name;
    this._tableId = tableId;
    this._type = type;
    this._validator = () => true;
  }

  public get id() {
    return this._id;
  }

  public get name() {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get tableId() {
    return this._tableId;
  }

  public get type() {
    return this._type;
  }

  public set type(value: FieldType) {
    this._type = value;
    this._validator = DbmsValidation.getValidatorByType(value);
  }

  public validate(value: unknown): boolean {
    return this._validator(value);
  }
}

export default Column;
