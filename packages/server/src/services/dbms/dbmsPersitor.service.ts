import fs, { promises as fsPromises } from 'fs';
import {
  PersistedColumn,
  PersistedColumnsIndex,
  PersistedDatabase,
  PersistedTable,
  PersistedTablesIndex,
} from '@interfaces/dbms/persistedDbms.interface';
import Database from '@models/dbms/database';
import Table, { ColumnsIndex } from '@models/dbms/table';
import Column from '@models/dbms/column';

class DbmsPersistor {
  public basePath = `${process.cwd()}/storage`;
  public databasesFolder = `${this.basePath}/databases`;
  public tablesFolder = `${this.basePath}/tables`;
  public recordsFolder = `${this.basePath}/records`;

  constructor() {
    fs.mkdirSync(this.databasesFolder, { recursive: true });
    fs.mkdirSync(this.tablesFolder, { recursive: true });
    fs.mkdirSync(this.recordsFolder, { recursive: true });
  }

  public readDatabases(): Database[] {
    const persistedDatabases = this.readDatabasesFiles();
    return persistedDatabases.map((database) => {
      const persistedDatabaseTables = this.readDatabaseTablesFiles(database);

      const tablesInstances = persistedDatabaseTables.map((table) => {
        const persistedColumns = Object.values(table.columnsIndex);
        const columnsInstances = DbmsPersistor.createColumns(persistedColumns);
        return DbmsPersistor.createTable(table, columnsInstances);
      });

      return DbmsPersistor.createDatabase(database, tablesInstances);
    });
  }

  private readDatabasesFiles(): PersistedDatabase[] {
    const databasesFilenames = fs.readdirSync(this.databasesFolder);
    const databasesFilesPaths = databasesFilenames.map((filename) =>
      this.createDatabasePath(filename.replace('.json', ''))
    );
    const databasesFiles = databasesFilesPaths.map((path) => fs.readFileSync(path));
    return databasesFiles.map((file) => JSON.parse(file.toString()) as PersistedDatabase);
  }

  private readDatabaseTablesFiles(database: PersistedDatabase): PersistedTable[] {
    const { id: databaseId, tablesIndex } = database;
    const tablesIds = Object.keys(tablesIndex);
    const tablesFilesPaths = tablesIds.map((tableId) => this.createTablePath(databaseId, tableId));
    const tablesFiles = tablesFilesPaths.map((path) => fs.readFileSync(path));
    return tablesFiles.map((file) => JSON.parse(file.toString()) as PersistedTable);
  }

  public async writeDatabase(database: Database) {
    const { id, name, tables } = database;
    const databaseFilePath = this.createDatabasePath(id);
    const persistContent = {
      id,
      name,
      tablesIndex: createPersistTablesIndex(tables),
    };
    const persistContentStr = JSON.stringify(persistContent);
    return fsPromises.writeFile(databaseFilePath, persistContentStr);

    function createPersistTablesIndex(tables: Table[]): PersistedTablesIndex {
      return tables.reduce((index, table) => {
        const tableId = table.id;
        index[tableId] = { id: tableId };
        return index;
      }, {} as PersistedTablesIndex);
    }
  }

  public async deleteDatabase(database: Database) {
    const { id, tables } = database;
    const tablesDeletion = tables.map(this.deleteTable);
    await Promise.all(tablesDeletion);

    const databaseFilePath = this.createDatabasePath(id);
    return fsPromises.unlink(databaseFilePath);
  }

  public async deleteTable(table: Table) {
    const { id, databaseId, columnsIndex } = table;
    const columns = Object.values(columnsIndex);
    const columnsDeletion = columns.map(this.deleteColumn);
    await Promise.all(columnsDeletion);

    const tableFilePath = this.createTablePath(databaseId, id);
    return fsPromises.unlink(tableFilePath);
  }

  public async deleteColumn(column: Column) {}

  public async writeTable(table: Table) {
    const { id, name, databaseId, columnsIndex } = table;
    const tableFilePath = this.createTablePath(databaseId, id);
    const persistContent = {
      id,
      name,
      databaseId,
      columnsIndex: createPersistColumnsIndex(columnsIndex),
    };
    const persistContentStr = JSON.stringify(persistContent);
    return fsPromises.writeFile(tableFilePath, persistContentStr);

    function createPersistColumnsIndex(columnsIndex: ColumnsIndex): PersistedColumnsIndex {
      return Object.values(columnsIndex).reduce((index, column) => {
        const { id: columnId, name: columnName, tableId, type: columnType } = column;
        index[columnId] = { id: columnId, name: columnName, tableId, type: columnType };
        return index;
      }, {} as PersistedColumnsIndex);
    }
  }

  private createDatabasePath(databaseId: string): string {
    return `${this.databasesFolder}/${databaseId}.json`;
  }

  private createTablePath(databaseId: string, tableId: string): string {
    return `${this.tablesFolder}/${databaseId}_${tableId}.json`;
  }

  private static createColumns(columns: PersistedColumn[]): Column[] {
    return columns.map(({ id, name, tableId, type }) => new Column({ id, name, tableId, type }));
  }

  private static createTable(table: PersistedTable, columns: Column[]): Table {
    const { id, name, databaseId } = table;
    return new Table({ id, name, databaseId, columns });
  }

  private static createDatabase(database: PersistedDatabase, tables: Table[]): Database {
    const { id, name } = database;
    return new Database({ id, name, tables });
  }
}

export default DbmsPersistor;
