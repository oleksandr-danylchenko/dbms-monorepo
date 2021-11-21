import { nanoid } from 'nanoid';
import { normalize } from '@utils/normalization.helper';
import Table from '@models/dbms/table';

export interface TablesIndex {
  [tableId: string]: Table;
}

class Database {
  public id: string;
  public name: string;
  public tablesIndex: TablesIndex;

  constructor({ id, name, tables }: { id?: string; name: string; tables: Table[] }) {
    this.id = id || nanoid();
    this.name = name;
    this.tablesIndex = normalize(tables);
  }

  get tables(): Table[] {
    return Object.values(this.tablesIndex);
  }

  public getTable(id: string): Table | undefined {
    return this.tablesIndex[id];
  }

  get tablesAmount(): number {
    return this.tables.length;
  }
}

export default Database;
