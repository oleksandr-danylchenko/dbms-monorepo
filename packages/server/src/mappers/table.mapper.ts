import Table from '@models/dbms/table';
import { TableDto } from '@dtos/table.dto';
import Column from '@models/dbms/column';

class TableMapper {
  public static toDto(table: Table): TableDto {
    return {
      id: table.id,
      name: table.name,
      databaseId: table.databaseId,
      columnsIndex: createDtoColumnsIndex(table.columns),
    };

    function createDtoColumnsIndex(columns: Column[]): TableDto['columnsIndex'] {
      return columns.reduce((index, column) => {
        const columnId = column.id;
        index[columnId] = { id: columnId, name: column.name, tableId: column.tableId, type: column.type };
        return index;
      }, {} as TableDto['columnsIndex']);
    }
  }
}

export default TableMapper;
