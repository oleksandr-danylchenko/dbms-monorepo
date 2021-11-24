import Database, { TablesIndex } from '@models/dbms/database';
import { DatabaseDto } from '@dtos/database.dto';
import { PersistedTable } from '@interfaces/dbms/persistedDbms.interface';

class DatabaseMapper {
  public static toDto(database: Database): DatabaseDto {
    return {
      id: database.id,
      name: database.name,
      tablesIndex: createDtoTablesIndex(database.tablesIndex),
    };

    function createDtoTablesIndex(tablesIndex: TablesIndex): {
      [tableId: string]: Pick<PersistedTable, 'id' | 'name'>;
    } {
      return Object.values(tablesIndex).reduce((index, table) => {
        const tableId = table.id;
        index[tableId] = { id: tableId, name: table.name };
        return index;
      }, {} as any);
    }
  }
}

export default DatabaseMapper;
