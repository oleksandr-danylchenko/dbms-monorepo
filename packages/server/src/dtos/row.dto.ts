import { RowColumnsValuesIndex } from '@models/dbms/row';
import { IsObject } from 'class-validator';

export interface RowDto {
  id: string;
  tableId: string;
  columnsValuesIndex: RowColumnsValuesIndex;
}

// TODO Simplify and just pass an array of columns values
export class CreateRowDto {
  @IsObject()
  columnsValuesIndex!: RowColumnsValuesIndex;
}
