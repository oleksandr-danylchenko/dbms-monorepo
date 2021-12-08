import { IsArray, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { ColumnDto, CreateColumnDto, UpdateColumnDto } from '@dtos/column.dto';
import { Type } from 'class-transformer';

export interface TableDto {
  id: string;
  name: string;
  databaseId: string;
  columnsIndex: {
    [columnId: string]: ColumnDto;
  };
}

export class CreateTableDto {
  @IsString()
  @MinLength(1)
  public name!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateColumnDto)
  public columns!: CreateColumnDto[];
}

export class UpdateTableDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  public name?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateColumnDto)
  @IsOptional()
  public columns?: UpdateColumnDto[];
}
