import { IsString, MinLength } from 'class-validator';
import { TableDto } from '@dtos/table.dto';

export interface DatabaseDto {
  id: string;
  name: string;
  tablesIndex: {
    [tableId: string]: Pick<TableDto, 'id' | 'name'>;
  };
}

export class CreateDatabaseDto {
  @IsString()
  @MinLength(1)
  public name!: string;
}

export class UpdateDatabaseDto extends CreateDatabaseDto {}
