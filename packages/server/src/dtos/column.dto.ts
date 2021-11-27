import { IsString, MinLength } from 'class-validator';

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
}

export class UpdateColumnDto {
  @IsString()
  @MinLength(1)
  public name!: string;
}
