interface FieldType {
  integer: 'integer';
  real: 'real';
  char: 'char';
  string: 'string';
  picture: 'picture';
}

interface PersistedEntity {
  id: number;
  name: string;
}

export interface PersistedDatabase extends PersistedEntity {
  tablesIndex: {
    [tableId: number]: Pick<PersistedTable, 'id'>;
  };
}

export interface PersistedTable extends PersistedEntity {
  columnsIndex: {
    [columnName: string]: PersistedColumn;
  };
}

export interface PersistedColumn extends PersistedEntity {
  name: string;
  type: FieldType;
}

export interface PersistedRecord extends PersistedEntity {
  columnsIndex: {
    [columnName: string]: {
      value: unknown;
    };
  };
}
