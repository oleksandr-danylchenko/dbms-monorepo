import { PersistedTable } from '@interfaces/dbms/persistedDbms.interface';

export interface DatabaseDto {
  id: string;
  name: string;
  tablesIndex: {
    [tableId: string]: Pick<PersistedTable, 'id' | 'name'>;
  };
}
