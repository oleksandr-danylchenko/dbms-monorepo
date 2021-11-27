import { PersistedTable } from '@interfaces/dbms/persistedDbms.interface';
import { IsString, MinLength } from 'class-validator';

export interface DatabaseDto {
  id: string;
  name: string;
  tablesIndex: {
    [tableId: string]: Pick<PersistedTable, 'id' | 'name'>;
  };
}

export class CreateDatabaseDto {
  @IsString()
  @MinLength(1)
  public name!: string;
}

export class UpdateDatabaseDto {
  @IsString()
  @MinLength(1)
  public name: string | undefined;
}
