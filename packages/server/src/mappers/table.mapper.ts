import Table, { ColumnsIndex } from '@models/dbms/table';
import { TableDto } from '@dtos/table.dto';

class TableMapper {
  public static toDto(table: Table): TableDto {
    return {
      id: table.id,
      name: table.name,
      databaseId: table.databaseId,
      columnsIndex: createDtoColumnsIndex(table.columnsIndex),
    };

    function createDtoColumnsIndex(columnsIndex: ColumnsIndex): TableDto['columnsIndex'] {
      return Object.values(columnsIndex).reduce((index, column) => {
        const columnId = column.id;
        index[columnId] = { id: columnId, name: column.name, type: column.type };
        return index;
      }, {} as any);
    }
  }
}

export default TableMapper;
