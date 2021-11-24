import { PersistedTable } from '@interfaces/dbms/persistedDbms.interface';
import { IsString } from 'class-validator';

export interface DatabaseDto {
  id: string;
  name: string;
  tablesIndex: {
    [tableId: string]: Pick<PersistedTable, 'id' | 'name'>;
  };
}

export class CreateDatabaseDto {
  @IsString()
  public name!: string;
}
