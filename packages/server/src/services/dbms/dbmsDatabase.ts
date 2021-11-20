import DbmsTable from '@services/dbms/dbmsTable';
import { nanoid } from 'nanoid';

interface TablesIndex {
  [tableId: string]: DbmsTable;
}

class DbmsDatabase {
  public id: string;
  public name: string;
  public tablesIndex: TablesIndex;

  constructor({ id, name, tables }: { id?: string; name: string; tables: DbmsTable[] }) {
    this.id = id || nanoid();
    this.name = name;
    this.tablesIndex = tables.reduce((index, table) => {
      index[table.id] = table;
      return index;
    }, {} as TablesIndex);
  }

  get tables(): DbmsTable[] {
    return Object.values(this.tablesIndex);
  }

  public getTable(id: string): DbmsTable | undefined {
    return this.tablesIndex[id];
  }

  get tablesAmount(): number {
    return this.tables.length;
  }
}

export default DbmsDatabase;
