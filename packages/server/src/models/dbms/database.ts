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

  public get id() {
    return this._id;
  }

  public get name() {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get tablesIds(): string[] {
    return Object.keys(this._tablesIndex);
  }

  public get tables(): Table[] {
    return Object.values(this._tablesIndex);
  }

  public getTable(id: string): Table | undefined {
    return this._tablesIndex[id];
  }

  public get tablesAmount(): number {
    return this.tablesIds.length;
  }

  public addTable(table: Table) {
    this._tablesIndex[table.id] = table;
  }

  public removeTable(tableId: string) {
    delete this._tablesIndex[tableId];
  }
}

export default Database;
