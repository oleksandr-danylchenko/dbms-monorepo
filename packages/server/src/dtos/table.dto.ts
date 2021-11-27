import { PersistedColumn } from '@interfaces/dbms/persistedDbms.interface';
import { IsString, MinLength } from 'class-validator';

export interface TableDto {
  id: string;
  name: string;
  databaseId: string;
  columnsIndex: {
    [columnId: string]: Pick<PersistedColumn, 'id' | 'name' | 'type'>;
  };
}

export class CreateTableDto {
  @IsString()
  @MinLength(1)
  public name!: string;
}

export class UpdateTableDto {
  @IsString()
  @MinLength(1)
  public name!: string;
}
