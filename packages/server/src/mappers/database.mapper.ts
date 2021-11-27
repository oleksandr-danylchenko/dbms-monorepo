import Database, { TablesIndex } from '@models/dbms/database';
import { DatabaseDto } from '@dtos/database.dto';

class DatabaseMapper {
  public static toDto(database: Database): DatabaseDto {
    return {
      id: database.id,
      name: database.name,
      tablesIndex: createDtoTablesIndex(database.tablesIndex),
    };

    function createDtoTablesIndex(tablesIndex: TablesIndex): DatabaseDto['tablesIndex'] {
      return Object.values(tablesIndex).reduce((index, table) => {
        const tableId = table.id;
        index[tableId] = { id: tableId, name: table.name };
        return index;
      }, {} as any);
    }
  }
}

export default DatabaseMapper;
