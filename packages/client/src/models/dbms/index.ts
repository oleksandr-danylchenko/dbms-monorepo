export enum FieldType {
  integer = 'integer',
  real = 'real',
  char = 'char',
  string = 'string',
  picture = 'picture',
  color = 'color',
}

export interface Database {
  id: string;
  name: string;
  tablesIndex: {
    [tableId: string]: Pick<Table, 'id' | 'name'>;
  };
}

export interface Table {
  id: string;
  name: string;
  databaseId: string;
  columnsIndex: TableColumnsIndex;
}

export interface TableColumnsIndex {
  [columnId: string]: Column;
}

export interface Column {
  id: string;
  name: string;
  tableId: string;
  type: FieldType;
  orderIndex: number;
}

export interface RowColumnValue {
  columnId: string;
  value: any;
}

export interface RowColumnsValuesIndex {
  [columnId: string]: RowColumnValue;
}

export interface Row {
  id: string;
  tableId: string;
  columnsValuesIndex: RowColumnsValuesIndex;
}
