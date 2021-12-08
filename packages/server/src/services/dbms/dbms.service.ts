import { denormalize, normalize } from '@utils/normalization.helper';
import Database from '@models/dbms/database';
import DbmsPersistor from '@services/dbms/persitor.service';
import { HttpException } from '@exceptions/HttpException';
import { CreateDatabaseDto, UpdateDatabaseDto } from '@dtos/database.dto';
import { isEmpty } from '@utils/util.helper';
import Table from '@models/dbms/table';
import { CreateTableDto, UpdateTableDto } from '@dtos/table.dto';
import Column from '@models/dbms/column';
import { CreateColumnDto, UpdateColumnDto } from '@dtos/column.dto';
import Row from '@models/dbms/row';
import { CreateRowDto } from '@dtos/row.dto';
import DbmsValidation from '@services/dbms/validation.service';

class DbmsService {
  private static _instance: DbmsService;

  public persistor = DbmsPersistor.getInstance();
  public databasesIndex: {
    [databaseId: string]: Database;
  };

  private constructor() {
    const databases = this.persistor.readDatabases();
    this.databasesIndex = normalize(databases);
  }

  public static getInstance(): DbmsService {
    if (!DbmsService._instance) {
      DbmsService._instance = new DbmsService();
    }
    return DbmsService._instance;
  }

  private checkUniqueEntityName<T extends { name: string }>(entities: T[], newName: string): boolean {
    const entityWithName = entities.find((entity) => entity.name === newName);
    return !entityWithName;
  }

  get allDatabases(): Database[] {
    return denormalize(this.databasesIndex);
  }

  public async findAllDatabases(): Promise<Database[]> {
    return this.allDatabases;
  }

  public async findDatabaseById(databaseId: string): Promise<Database> {
    const database = this.databasesIndex[databaseId];
    if (!database) throw new HttpException(404, `No database ${databaseId} found`);
    return database;
  }

  public async createDatabase(databaseData: CreateDatabaseDto): Promise<Database> {
    if (isEmpty(databaseData)) throw new HttpException(400, `There is no database creation data presented`);

    const { name: newDatabaseName } = databaseData;

    const isNameUnique = this.checkUniqueEntityName(this.allDatabases, newDatabaseName);
    if (!isNameUnique) throw new HttpException(409, `Database ${newDatabaseName} already exists`);

    const newDatabase = new Database({ name: newDatabaseName, tables: [] });
    this.databasesIndex[newDatabase.id] = newDatabase;
    await this.persistor.writeDatabase(newDatabase);

    return newDatabase;
  }

  public async updateDatabase(databaseId: string, databaseData: UpdateDatabaseDto): Promise<Database> {
    if (isEmpty(databaseData)) throw new HttpException(400, `There is no database data update presented`);
    const database = await this.findDatabaseById(databaseId);

    const { name: updateDatabaseName } = databaseData;
    if (!updateDatabaseName) return database;

    const isNameUnique =
      database.name === updateDatabaseName || this.checkUniqueEntityName(this.allDatabases, updateDatabaseName);
    if (!isNameUnique) throw new HttpException(409, `Database ${updateDatabaseName} already exists`);

    database.name = updateDatabaseName || database.name;
    await this.persistor.writeDatabase(database);

    return database;
  }

  public async deleteDatabase(databaseId: string): Promise<void> {
    const database = this.databasesIndex[databaseId];
    if (!database) throw new HttpException(404, `No database ${databaseId} found`);

    delete this.databasesIndex[databaseId];
    await this.persistor.deleteDatabase(database);
    return;
  }

  public async findAllTablesByDatabaseId(databaseId: string): Promise<Table[]> {
    const database = await this.findDatabaseById(databaseId);
    return database.tables;
  }

  public async findTableById(databaseId: string, tableId: string): Promise<Table>;
  public async findTableById(database: Database, tableId: string): Promise<Table>;
  public async findTableById(database: string | Database, tableId: string): Promise<Table> {
    let table: Table | undefined;
    if (database instanceof Database) {
      table = database.getTable(tableId);
    } else {
      const databaseEntity = await this.findDatabaseById(database);
      table = databaseEntity.getTable(tableId);
    }
    if (!table) throw new HttpException(404, `No table ${tableId} found`);
    return table;
  }

  public async createTable(databaseId: string, tableData: CreateTableDto): Promise<Table> {
    if (isEmpty(tableData)) throw new HttpException(400, `There is no table creation data presented`);

    const database = await this.findDatabaseById(databaseId);
    const tables = database.tables;

    const { name: tableName, columns: columnsDtos } = tableData;

    const isNameUnique = this.checkUniqueEntityName(tables, tableName);
    if (!isNameUnique) throw new HttpException(409, `Table ${tableName} already exists`);

    const newTable = new Table({ name: tableName, databaseId });
    DbmsService.createTableColumns(newTable, columnsDtos);

    database.addTable(newTable);
    await this.persistor.writeDatabase(database);
    await this.persistor.writeTable(newTable);

    return newTable;
  }

  public async updateTable(databaseId: string, tableId: string, tableData: UpdateTableDto): Promise<Table> {
    if (isEmpty(tableData)) throw new HttpException(400, `There is no table data update presented`);

    const database = await this.findDatabaseById(databaseId);
    const tables = database.tables;
    const table = await this.findTableById(database, tableId);

    const { name: tableName, columns: columnsDtos } = tableData;

    const isNameUnique = !tableName || table.name === tableName || this.checkUniqueEntityName(tables, tableName);
    if (!isNameUnique) throw new HttpException(409, `Table ${tableName} already exists`);

    table.name = tableName || table.name;
    await this.updateTableColumns(table, columnsDtos);

    await this.persistor.writeTable(table);

    return table;
  }

  private static createTableColumns(table: Table, columnsDtos: CreateColumnDto[]): void {
    DbmsService.validateUniqueColumnsProperties(columnsDtos);

    const newColumns = DbmsService.createColumns(table.id, columnsDtos);
    table.setColumns(newColumns);
  }

  private static createColumns(tableId: string, columnsDtos: (CreateColumnDto | UpdateColumnDto)[]) {
    return columnsDtos.map(({ name, type, orderIndex }) => new Column({ name, type, tableId, orderIndex }));
  }

  private async updateTableColumns(table: Table, columnsDtos: UpdateColumnDto[]): Promise<void> {
    const columnsIndex = table.columnsIndex;
    const columnsIds = table.columnsIds;
    DbmsService.validateUniqueColumnsProperties(columnsDtos);

    /**
     * Update the existing columns names
     */
    const existingColumns = columnsDtos
      .filter(({ id: columnId }) => columnsIds.includes(columnId))
      .map(({ id: columnId, name: columnName, orderIndex: columnOrderIndex }) => {
        const column = columnsIndex[columnId];
        column.name = columnName || column.name;
        column.orderIndex = columnOrderIndex ?? column.orderIndex;
        return column;
      });

    /**
     * Only the columns without an id can be considered as the new ones
     */
    const newColumnsDtos = columnsDtos.filter(({ id: columnId }) => !columnId);
    const newColumns = DbmsService.createColumns(table.id, newColumnsDtos);

    const updatedColumns = [...existingColumns, ...newColumns];
    DbmsService.validateUniqueColumnsProperties(updatedColumns);

    /**
     * Delete all existing columns which are not presented in the update
     */
    const columnsDtosIds = columnsDtos.map((column) => column.id);
    const missingColumnsIds = columnsIds.filter((columnId) => !columnsDtosIds.includes(columnId));
    if (missingColumnsIds.length) {
      await this.removeTableColumns(table, missingColumnsIds);
    }

    table.setColumns(updatedColumns);
  }

  private static validateUniqueColumnsProperties(columns: (Column | CreateColumnDto | UpdateColumnDto)[]): void {
    const columnsNames = columns.map((column) => column.name);
    const columnsOrderIndices = columns.map((column) => column.orderIndex);

    const duplicatedColumnsNames = columnsNames.filter((name, index, arr) => index !== arr.indexOf(name)); // Filter only non-unique names
    if (duplicatedColumnsNames.length) {
      const uniqueDuplicatedNames = [...new Set(duplicatedColumnsNames)]; // Remove repeating duplicated names. E.g. [column1, column1] -> [column1]
      throw new HttpException(400, `Table cannot have duplicated columns names: [${uniqueDuplicatedNames.join(', ')}]`);
    }

    const duplicatedColumnsOrderIndices = columnsOrderIndices.filter(
      (orderIndex, index, arr) => index !== arr.indexOf(orderIndex)
    ); // Filter only non-unique indices
    if (duplicatedColumnsOrderIndices.length) {
      throw new HttpException(
        400,
        `Columns cannot have the same order indices: [${duplicatedColumnsOrderIndices.join(', ')}]`
      );
    }
  }

  private async removeTableColumns(table: Table, columnsIds: string[]) {
    table.removeColumns(columnsIds);
    await this.persistor.deleteRowsColumns(table.databaseId, table.id, columnsIds);
  }

  public async deleteTable(databaseId: string, tableId: string): Promise<void> {
    const database = await this.findDatabaseById(databaseId);
    const table = await this.findTableById(database, tableId);

    database.removeTable(tableId);
    await this.persistor.writeDatabase(database);
    await this.persistor.deleteTable(table);
    return;
  }

  public async findAllColumns(databaseId: string, tableId: string): Promise<Column[]> {
    const table = await this.findTableById(databaseId, tableId);
    return table.columns;
  }

  public async findAllRows(databaseId: string, tableId: string): Promise<Row[]> {
    await this.findTableById(databaseId, tableId);
    return this.persistor.readRows(databaseId, tableId);
  }

  public async projectRows(databaseId: string, tableId: string, projectionColumnsIds: string[]): Promise<Row[]> {
    if (!Array.isArray(projectionColumnsIds)) throw new HttpException(400, `Projection columns ids are malformed`);

    await this.findTableById(databaseId, tableId);
    return this.persistor.readProjectedRows(databaseId, tableId, projectionColumnsIds);
  }

  public async createRow(databaseId: string, tableId: string, rowData: CreateRowDto): Promise<Row> {
    if (isEmpty(rowData)) throw new HttpException(400, `There is no column creation data presented`);

    const table = await this.findTableById(databaseId, tableId);
    const columnsIndex = table.columnsIndex;

    const { columnsValuesIndex: rowColumnsValuesIndex } = rowData;

    const { errorMessage } = DbmsValidation.validateRowCreationValues(columnsIndex, rowColumnsValuesIndex);
    if (errorMessage !== null) {
      throw new HttpException(400, errorMessage);
    }

    const newRow = new Row({ tableId, columnsValuesIndex: rowColumnsValuesIndex });
    await this.persistor.writeRow(databaseId, tableId, newRow);

    return newRow;
  }

  public async deleteRow(databaseId: string, tableId: string, rowId: string): Promise<void> {
    await this.persistor.removeRow(databaseId, tableId, rowId);
    return;
  }
}

export default DbmsService;
