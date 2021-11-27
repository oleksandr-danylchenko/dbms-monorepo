import fs, { promises as fsPromises } from 'fs';
import {
  PersistedColumn,
  PersistedColumnsIndex,
  PersistedDatabase,
  PersistedTable,
  PersistedTablesIndex,
} from '@interfaces/dbms/persistedDbms.interface';
import Database from '@models/dbms/database';
import Table from '@models/dbms/table';
import Column from '@models/dbms/column';
import Row from '@models/dbms/row';

class DbmsPersistor {
  public readonly basePath = `${process.cwd()}/storage`;
  public readonly databasesFolder = `${this.basePath}/databases`;
  public readonly tablesFolder = `${this.basePath}/tables`;
  public readonly rowsFolder = `${this.basePath}/rows`;

  constructor() {
    fs.mkdirSync(this.databasesFolder, { recursive: true });
    fs.mkdirSync(this.tablesFolder, { recursive: true });
    fs.mkdirSync(this.rowsFolder, { recursive: true });
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

  public async writeTable(table: Table) {
    const { id, name, databaseId, columns, columnsOrderIndex } = table;
    const tableFilePath = this.createTablePath(databaseId, id);
    const persistContent = {
      id,
      name,
      databaseId,
      columnsIndex: createPersistColumnsIndex(columns),
      columnsOrderIndex,
    };
    const persistContentStr = JSON.stringify(persistContent);
    return fsPromises.writeFile(tableFilePath, persistContentStr);

    function createPersistColumnsIndex(columns: Column[]): PersistedColumnsIndex {
      return columns.reduce((index, column) => {
        const { id: columnId, name: columnName, tableId, type: columnType } = column;
        index[columnId] = { id: columnId, name: columnName, tableId, type: columnType };
        return index;
      }, {} as PersistedColumnsIndex);
    }
  }

  public async deleteTable(table: Table) {
    const { id, databaseId } = table;
    const tableFilePath = this.createTablePath(databaseId, id);
    return fsPromises.unlink(tableFilePath);
  }

  public async writeRow(databaseId: string, tableId: string, row: Row) {
    const { id, columnValuesIndex } = row;
    const rowsFilePath = this.createRowsPath(databaseId, tableId);
    const persistContent = { id, tableId, rowColumnsValuesIndex: columnValuesIndex };
    const persistContentStr = JSON.stringify(persistContent);
    return fsPromises.writeFile(rowsFilePath, persistContentStr, { flag: 'a' });
  }

  private createDatabasePath(databaseId: string): string {
    return `${this.databasesFolder}/${databaseId}.json`;
  }

  private createTablePath(databaseId: string, tableId: string): string {
    return `${this.tablesFolder}/${databaseId}_${tableId}.json`;
  }

  private createRowsPath(databaseId: string, tableId: string): string {
    return `${this.rowsFolder}/${databaseId}_${tableId}_rows.json`;
  }

  private static createColumns(columns: PersistedColumn[]): Column[] {
    return columns.map(({ id, name, tableId, type }) => new Column({ id, name, tableId, type }));
  }

  private static createTable(table: PersistedTable, columns: Column[]): Table {
    const { id, name, databaseId, columnsOrderIndex } = table;
    return new Table({ id, name, databaseId, columns, columnsOrderIndex });
  }

  private static createDatabase(database: PersistedDatabase, tables: Table[]): Database {
    const { id, name } = database;
    return new Database({ id, name, tables });
  }
}

export default DbmsPersistor;
