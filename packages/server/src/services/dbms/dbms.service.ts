import { denormalize, normalize } from '@utils/normalization.helper';
import Database from '@models/dbms/database';
import DbmsPersistor from '@services/dbms/dbmsPersitor.service';
import { HttpException } from '@exceptions/HttpException';
import { CreateDatabaseDto, UpdateDatabaseDto } from '@dtos/database.dto';
import { isEmpty } from '@utils/util.helper';
import Table from '@models/dbms/table';
import { CreateTableDto, UpdateTableDto } from '@dtos/table.dto';

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

    const { name: newDatabaseName } = databaseData;
    if (!newDatabaseName) return database;

    const isNameUnique = this.checkUniqueEntityName(this.allDatabases, newDatabaseName);
    if (!isNameUnique) throw new HttpException(409, `Database ${newDatabaseName} already exists`);

    database.name = newDatabaseName;
    await this.dbmsPersistor.writeDatabase(database);

    return database;
  }

  public async deleteDatabase(databaseId: string): Promise<void> {
    const database = this.databasesIndex[databaseId];
    if (!database) throw new HttpException(404, `No database ${databaseId} found`);

    delete this.databasesIndex[databaseId];
    return this.dbmsPersistor.deleteDatabase(database);
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

    const newTable = new Table({ name: newTableName, databaseId, columns: [] });
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

    const { name: newTableName } = tableData;
    if (!newTableName) return table;

    const isNameUnique = this.checkUniqueEntityName(tables, newTableName);
    if (!isNameUnique) throw new HttpException(409, `Table ${newTableName} already exists`);

    table.name = newTableName;
    await this.dbmsPersistor.writeTable(table);

    return table;
  }

  public async deleteTable(databaseId: string, tableId: string): Promise<void> {
    const database = await this.findDatabaseById(databaseId);
    const table = await this.findTableById(database, tableId);

    database.removeTable(tableId);
    await this.dbmsPersistor.writeDatabase(database);
    return this.dbmsPersistor.deleteTable(table);
  }
}

export default DbmsService;
