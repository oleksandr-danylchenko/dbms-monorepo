import { IsArray, IsString, MinLength } from 'class-validator';
import { ColumnDto } from '@dtos/column.dto';

export interface TableDto {
  id: string;
  name: string;
  databaseId: string;
  columnsIndex: {
    [columnId: string]: Pick<ColumnDto, 'id' | 'name' | 'type' | 'tableId'>;
  };
  columnsOrderIndex: string[];
}

export class CreateTableDto {
  @IsString()
  @MinLength(1)
  public name!: string;
}

export class UpdateTableDto extends CreateTableDto {
  @IsArray()
  @IsString({ each: true })
  public columnsOrderIndex!: string[];
}
