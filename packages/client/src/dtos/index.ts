import { Column, Database, Row, Table } from '../models/dbms';

export type CreateDatabaseDto = Pick<Database, 'name'>;
export type UpdateDatabaseDto = CreateDatabaseDto;

export interface CreateTableDto extends Pick<Table, 'name'> {
  columns: CreateColumnDto[];
}
export interface UpdateTableDto extends Pick<Table, 'name'> {
  columns: UpdateColumnDto[];
}

export type CreateColumnDto = Pick<Column, 'name' | 'type' | 'orderIndex'>;
export type UpdateColumnDto = Pick<Column, 'id'> & CreateColumnDto;

export type CreateRowDto = Pick<Row, 'columnsValuesIndex'>;
