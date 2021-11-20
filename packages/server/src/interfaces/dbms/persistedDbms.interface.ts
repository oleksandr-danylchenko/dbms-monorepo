import { FieldType } from '@interfaces/dbms/dbms.interface';

interface PersistedEntity {
  id: string;
  name: string;
}

export interface PersistedDatabase extends PersistedEntity {
  tablesIndex: PersistedTablesIndex;
}

export interface PersistedTablesIndex {
  [tableId: string]: Pick<PersistedTable, 'id'>;
}

export interface PersistedTable extends PersistedEntity {
  databaseId: string;
  columnsIndex: {
    [columnId: string]: PersistedColumn;
  };
}

export interface PersistedColumn extends PersistedEntity {
  tableId: string;
  type: FieldType;
}

export interface PersistedRecord {
  columnsIndex: {
    [columnName: string]: {
      value: unknown;
    };
  };
}
