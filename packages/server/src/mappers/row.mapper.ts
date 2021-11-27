import Row from '@models/dbms/row';
import { RowDto } from '@dtos/row.dto';

class RowMapper {
  public static toDto(row: Row): RowDto {
    return {
      id: row.id,
      tableId: row.tableId,
      columnsValuesIndex: row.columnsValuesIndex,
    };
  }
}

export default RowMapper;
