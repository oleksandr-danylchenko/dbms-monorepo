import { RowColumnsValuesIndex } from '@models/dbms/row';
import { IsObject } from 'class-validator';

export interface RowDto {
  id: string;
  tableId: string;
  columnsValuesIndex: RowColumnsValuesIndex;
}

export class CreateRowDto {
  @IsObject()
  columnsValuesIndex!: RowColumnsValuesIndex;
}
