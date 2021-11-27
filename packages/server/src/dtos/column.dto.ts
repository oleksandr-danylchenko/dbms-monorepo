import { IsString, MinLength } from 'class-validator';
import { FieldType } from '@interfaces/dbms/dbms.interface';

export interface ColumnDto {
  id: string;
  name: string;
  tableId: string;
  type: string;
}

export class CreateColumnDto {
  @IsString()
  @MinLength(1)
  public name!: string;

  @IsString()
  @MinLength(1)
  public type!: FieldType;
}

export class UpdateColumnDto extends CreateColumnDto {}
