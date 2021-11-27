import { RowColumnsValuesIndex } from '@models/dbms/row';
import { IsJSON } from 'class-validator';

export interface RowDto {
  id: string;
  tableId: string;
  columnsValuesIndex: RowColumnsValuesIndex;
}

export class CreateRowDto {
  @IsJSON()
  columnsValuesIndex!: RowColumnsValuesIndex;
}

export class UpdateRowDto extends CreateRowDto {}
