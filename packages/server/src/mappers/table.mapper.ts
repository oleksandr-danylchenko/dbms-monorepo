import Table from '@models/dbms/table';
import { TableDto } from '@dtos/table.dto';
import Column from '@models/dbms/column';
import ColumnMapper from '@/mappers/column.mapper';

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
        index[columnId] = ColumnMapper.toDto(column);
        return index;
      }, {} as TableDto['columnsIndex']);
    }
  }
}

export default TableMapper;
