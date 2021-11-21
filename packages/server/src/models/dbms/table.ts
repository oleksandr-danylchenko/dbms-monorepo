import { nanoid } from 'nanoid';
import { normalize } from '@utils/normalization.helper';
import Column from '@models/dbms/column';

export interface ColumnsIndex {
  [columnId: string]: Column;
}

class Table {
  public id: string;
  public name: string;
  public databaseId: string;
  public columnsIndex: ColumnsIndex;

  constructor({ id, name, databaseId, columns }: { id?: string; name: string; databaseId: string; columns: Column[] }) {
    this.id = id || nanoid();
    this.name = name;
    this.databaseId = databaseId;
    this.columnsIndex = normalize(columns);
  }

  get columns(): Column[] {
    return Object.values(this.columnsIndex);
  }

  public getColumn(id: string): Column | undefined {
    return this.columnsIndex[id];
  }
}

export default Table;
