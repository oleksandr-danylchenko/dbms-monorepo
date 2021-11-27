import { PersistedColumn } from '@interfaces/dbms/persistedDbms.interface';
import { IsString } from 'class-validator';

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
  public name!: string;

  @IsString()
  public databaseId!: string;
}
