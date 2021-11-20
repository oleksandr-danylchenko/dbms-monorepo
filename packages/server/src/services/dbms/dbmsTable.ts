import { nanoid } from 'nanoid';
import DbmsColumn from '@services/dbms/dbmsColumn';
import { normalize } from '@utils/normalization.helper';

class DbmsTable {
  public id: string;
  public name: string;
  public databaseId: string;
  public columnsIndex: {
    [columnId: string]: DbmsColumn;
  };

  constructor({
    id,
    name,
    databaseId,
    columns,
  }: {
    id?: string;
    name: string;
    databaseId: string;
    columns: DbmsColumn[];
  }) {
    this.id = id || nanoid();
    this.name = name;
    this.databaseId = databaseId;
    this.columnsIndex = normalize(columns);
  }

  get columns(): DbmsColumn[] {
    return Object.values(this.columnsIndex);
  }

  public getColumn(id: string): DbmsColumn | undefined {
    return this.columnsIndex[id];
  }
}

export default DbmsTable;
