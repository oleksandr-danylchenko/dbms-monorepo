import { Column, Database, Row, Table } from '../models/dbms';

export type CreateDatabaseDto = Pick<Database, 'name'>;
export type UpdateDatabaseDto = CreateDatabaseDto;

export type CreateTableDto = Pick<Table, 'name'>;
export type UpdateTableDto = Pick<Table, 'name' | 'columnsOrderIndex'>;

export type CreateColumnDto = Pick<Column, 'name' | 'type'>;
export type UpdateColumnDto = Pick<Column, 'name'>;

export type CreateRowDto = Pick<Row, 'columnsValuesIndex'>;
