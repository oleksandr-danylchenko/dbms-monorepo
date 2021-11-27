import { FieldType } from '@interfaces/dbms/dbms.interface';
import { RowColumnsValuesIndex } from '@models/dbms/row';

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
  columnsIndex: PersistedColumnsIndex;
  columnsOrderIndex: string[];
}

export interface PersistedColumnsIndex {
  [columnId: string]: PersistedColumn;
}

export interface PersistedColumn extends PersistedEntity {
  tableId: string;
  type: FieldType;
}

export interface PersistedRow {
  id: string;
  tableId: string;
  rowColumnsValuesIndex: RowColumnsValuesIndex;
}
