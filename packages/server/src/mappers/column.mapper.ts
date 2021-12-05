import Column from '@models/dbms/column';
import { ColumnDto } from '@dtos/column.dto';

class ColumnMapper {
  public static toDto(column: Column): ColumnDto {
    return {
      id: column.id,
      name: column.name,
      tableId: column.tableId,
      type: column.type,
      orderIndex: column.orderIndex,
    };
  }
}

export default ColumnMapper;
