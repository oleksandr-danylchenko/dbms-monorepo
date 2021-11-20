import { FieldType } from '@interfaces/dbms/dbms.interface';

interface PersistedEntity {
  id: string;
  name: string;
}

export interface PersistedDatabase extends PersistedEntity {
  tablesIndex: {
    [tableId: string]: Pick<PersistedTable, 'id'>;
  };
}

export interface PersistedTable extends PersistedEntity {
  columnsIndex: {
    [columnId: string]: PersistedColumn;
  };
}

export interface PersistedColumn extends PersistedEntity {
  type: FieldType;
}

export interface PersistedRecord {
  columnsIndex: {
    [columnName: string]: {
      value: unknown;
    };
  };
}
