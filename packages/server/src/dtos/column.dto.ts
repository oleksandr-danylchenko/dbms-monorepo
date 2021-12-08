import { IsEnum, IsInt, IsOptional, IsString, MinLength } from 'class-validator';
import { FieldType } from '@interfaces/dbms/dbms.interface';

export interface ColumnDto {
  id: string;
  name: string;
  tableId: string;
  type: FieldType;
  orderIndex: number;
}

export class CreateColumnDto {
  @IsString()
  @MinLength(1)
  public name!: string;

  @IsString()
  @MinLength(1)
  @IsEnum(FieldType)
  public type!: FieldType;

  @IsInt()
  public orderIndex!: number;
}

export class UpdateColumnDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  public id?: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  public name?: string;

  @IsString()
  @MinLength(1)
  @IsOptional()
  public type?: FieldType;

  @IsInt()
  public orderIndex!: number;
}
