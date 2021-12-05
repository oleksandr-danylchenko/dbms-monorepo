import { nanoid } from 'nanoid';
import { FieldType } from '@interfaces/dbms/dbms.interface';
import DbmsValidation, { Validator } from '@services/dbms/validation.service';

class Column {
  private readonly _id: string;
  private _name: string;
  private readonly _tableId: string;
  private _orderIndex: number;
  private _type: FieldType;
  private _validator: Validator;

  constructor({
    id,
    name,
    type,
    tableId,
    orderIndex,
  }: {
    id?: string;
    name: string;
    type: FieldType;
    tableId: string;
    orderIndex: number;
  }) {
    this._id = id || nanoid();
    this._name = name;
    this._tableId = tableId;
    this._orderIndex = orderIndex;
    this._type = type;
    this._validator = DbmsValidation.getValidatorByType(type);
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

  public get orderIndex() {
    return this._orderIndex;
  }

  public set orderIndex(value: number) {
    this._orderIndex = value;
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
