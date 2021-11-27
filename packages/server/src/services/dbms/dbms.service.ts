import { denormalize, normalize } from '@utils/normalization.helper';
import Database from '@models/dbms/database';
import DbmsPersistor from '@services/dbms/dbmsPersitor.service';
import { HttpException } from '@exceptions/HttpException';
import { CreateDatabaseDto, UpdateDatabaseDto } from '@dtos/database.dto';
import { areEmpty, isEmpty } from '@utils/util.helper';
import Table from '@models/dbms/table';
import { CreateTableDto, UpdateTableDto } from '@dtos/table.dto';
import Column from '@models/dbms/column';
import { CreateColumnDto, UpdateColumnDto } from '@dtos/column.dto';

class DbmsService {
  public dbmsPersistor = new DbmsPersistor();
  public databasesIndex: {
    [databaseId: string]: Database;
  };

  constructor() {
    const databases = this.dbmsPersistor.readDatabases();
    this.databasesIndex = normalize(databases);
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
    await this.dbmsPersistor.writeDatabase(newDatabase);

    return newDatabase;
  }

  public async updateDatabase(databaseId: string, databaseData: UpdateDatabaseDto): Promise<Database> {
    if (isEmpty(databaseData)) throw new HttpException(400, `There is no database data update presented`);
    const database = await this.findDatabaseById(databaseId);

    const { name: updateDatabaseName } = databaseData;
    if (!updateDatabaseName) return database;

    const isNameUnique = this.checkUniqueEntityName(this.allDatabases, updateDatabaseName);
    if (!isNameUnique) throw new HttpException(409, `Database ${updateDatabaseName} already exists`);

    database.name = updateDatabaseName;
    await this.dbmsPersistor.writeDatabase(database);

    return database;
  }

  public async deleteDatabase(databaseId: string): Promise<void> {
    const database = this.databasesIndex[databaseId];
    if (!database) throw new HttpException(404, `No database ${databaseId} found`);

    delete this.databasesIndex[databaseId];
    await this.dbmsPersistor.deleteDatabase(database);
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

    const { name: newTableName } = tableData;

    const isNameUnique = this.checkUniqueEntityName(tables, newTableName);
    if (!isNameUnique) throw new HttpException(409, `Table ${newTableName} already exists`);

    const newTable = new Table({ name: newTableName, databaseId });
    database.addTable(newTable);
    await this.dbmsPersistor.writeDatabase(database);
    await this.dbmsPersistor.writeTable(newTable);

    return newTable;
  }

  public async updateTable(databaseId: string, tableId: string, tableData: UpdateTableDto): Promise<Table> {
    if (isEmpty(tableData)) throw new HttpException(400, `There is no table data update presented`);
    const database = await this.findDatabaseById(databaseId);
    const tables = database.tables;
    const table = await this.findTableById(database, tableId);

    const { name: updateTableName, orderIndex: updateOrderIndex } = tableData;
    if (areEmpty(updateTableName, updateOrderIndex)) return table;

    const isNameUnique = this.checkUniqueEntityName(tables, updateTableName);
    if (!isNameUnique) throw new HttpException(409, `Table ${updateTableName} already exists`);

    table.name = updateTableName || table.name;
    table.columnsOrderIndex = updateOrderIndex || table.columnsOrderIndex;
    await this.dbmsPersistor.writeTable(table);

    return table;
  }

  public async deleteTable(databaseId: string, tableId: string): Promise<void> {
    const database = await this.findDatabaseById(databaseId);
    const table = await this.findTableById(database, tableId);

    database.removeTable(tableId);
    await this.dbmsPersistor.writeDatabase(database);
    await this.dbmsPersistor.deleteTable(table);
    return;
  }

  public async findAllColumns(databaseId: string, tableId: string): Promise<Column[]> {
    const table = await this.findTableById(databaseId, tableId);
    return table.columns;
  }

  public async findColumnById(databaseId: string, tableId: string, columnId: string): Promise<Column> {
    const table = await this.findTableById(databaseId, tableId);
    return this.findColumnByIdWithTable(table, columnId);
  }

  public async findColumnByIdWithTable(table: Table, columnId: string): Promise<Column> {
    const column = table.getColumn(columnId);
    if (!column) throw new HttpException(404, `No column ${columnId} found`);
    return column;
  }

  public async createColumn(databaseId: string, tableId: string, columnData: CreateColumnDto): Promise<Column> {
    if (isEmpty(columnData)) throw new HttpException(400, `There is no column creation data presented`);
    const table = await this.findTableById(databaseId, tableId);
    const columns = table.columns;

    const { name: newColumnName, type: newColumnType } = columnData;

    const isNameUnique = this.checkUniqueEntityName(columns, newColumnName);
    if (!isNameUnique) throw new HttpException(409, `Column ${newColumnName} already exists`);

    const newColumn = new Column({ name: newColumnName, type: newColumnType, tableId });
    table.addColumn(newColumn);
    await this.dbmsPersistor.writeTable(table);

    return newColumn;
  }

  public async updateColumn(
    databaseId: string,
    tableId: string,
    columnId: string,
    columnData: UpdateColumnDto
  ): Promise<Column> {
    if (isEmpty(columnData)) throw new HttpException(400, `There is no column data update presented`);

    const table = await this.findTableById(databaseId, tableId);
    const columns = table.columns;
    const column = await this.findColumnByIdWithTable(table, columnId);

    const { name: updateColumnName, type: updateColumnType } = columnData;
    if (areEmpty(updateColumnName, updateColumnType)) return column;

    const isNameUnique = this.checkUniqueEntityName(columns, updateColumnName);
    if (!isNameUnique) throw new HttpException(409, `Column ${updateColumnName} already exists`);

    column.name = updateColumnName || column.name;
    column.type = updateColumnType || column.type;
    await this.dbmsPersistor.writeTable(table);

    return column;
  }

  public async deleteColumn(databaseId: string, tableId: string, columnId: string): Promise<void> {
    const table = await this.findTableById(databaseId, tableId);
    const column = await this.findColumnByIdWithTable(table, columnId);

    table.removeColumn(column);
    await this.dbmsPersistor.writeTable(table);
    return;
  }
}

export default DbmsService;
