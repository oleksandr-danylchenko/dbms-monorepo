import { nanoid } from 'nanoid';
import { normalize } from '@utils/normalization.helper';
import Column from '@models/dbms/column';

export interface ColumnsIndex {
  [columnId: string]: Column;
}

class Table {
  private readonly _id: string;
  private _name: string;
  private readonly _databaseId: string;
  private readonly _columnsIndex: ColumnsIndex;

  constructor({ id, name, databaseId, columns }: { id?: string; name: string; databaseId: string; columns: Column[] }) {
    this._id = id || nanoid();
    this._name = name;
    this._databaseId = databaseId;
    this._columnsIndex = normalize(columns);
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get databaseId() {
    return this._databaseId;
  }

  get columnsIds(): string[] {
    return Object.keys(this._columnsIndex);
  }

  get columns(): Column[] {
    return Object.values(this._columnsIndex);
  }

  public getColumn(id: string): Column | undefined {
    return this._columnsIndex[id];
  }

  get columnsAmount(): number {
    return this.columnsIds.length;
  }
}

export default Table;
