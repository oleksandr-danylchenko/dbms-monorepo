import { nanoid } from 'nanoid';
import { normalize } from '@utils/normalization.helper';
import Table from '@models/dbms/table';

export interface TablesIndex {
  [tableId: string]: Table;
}

class Database {
  private readonly _id: string;
  private _name: string;
  private readonly _tablesIndex: TablesIndex;

  constructor({ id, name, tables }: { id?: string; name: string; tables: Table[] }) {
    this._id = id || nanoid();
    this._name = name;
    this._tablesIndex = normalize(tables);
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

  get tablesIds(): string[] {
    return Object.keys(this._tablesIndex);
  }

  get tables(): Table[] {
    return Object.values(this._tablesIndex);
  }

  public getTable(id: string): Table | undefined {
    return this._tablesIndex[id];
  }

  get tablesAmount(): number {
    return this.tables.length;
  }
}

export default Database;
