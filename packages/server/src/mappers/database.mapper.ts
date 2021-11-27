import Database from '@models/dbms/database';
import { DatabaseDto } from '@dtos/database.dto';
import Table from '@models/dbms/table';

class DatabaseMapper {
  public static toDto(database: Database): DatabaseDto {
    return {
      id: database.id,
      name: database.name,
      tablesIndex: createDtoTablesIndex(database.tables),
    };

    function createDtoTablesIndex(tables: Table[]): DatabaseDto['tablesIndex'] {
      return tables.reduce((index, table) => {
        const tableId = table.id;
        index[tableId] = { id: tableId, name: table.name };
        return index;
      }, {} as DatabaseDto['tablesIndex']);
    }
  }
}

export default DatabaseMapper;
