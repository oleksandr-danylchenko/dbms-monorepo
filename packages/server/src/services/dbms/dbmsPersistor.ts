import fs, { promises as fsPromises } from 'fs';
import DbmsDatabase, { TablesIndex } from '@services/dbms/dbmsDatabase';
import {
  PersistedColumn,
  PersistedColumnsIndex,
  PersistedDatabase,
  PersistedTable,
  PersistedTablesIndex,
} from '@interfaces/dbms/persistedDbms.interface';
import DbmsColumn from '@services/dbms/dbmsColumn';
import DbmsTable, { ColumnsIndex } from '@services/dbms/dbmsTable';

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

  public readDatabases(): DbmsDatabase[] {
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

  public async writeDatabase(database: DbmsDatabase) {
    const { id, name, tablesIndex } = database;
    const databaseFilePath = this.createDatabasePath(id);
    const persistContent = {
      id,
      name,
      tablesIndex: createPersistTablesIndex(tablesIndex),
    };
    const persistContentStr = JSON.stringify(persistContent);
    return fsPromises.writeFile(databaseFilePath, persistContentStr);

    function createPersistTablesIndex(tablesIndex: TablesIndex): PersistedTablesIndex {
      return Object.values(tablesIndex).reduce((index, table) => {
        const tableId = table.id;
        index[tableId] = { id: tableId };
        return index;
      }, {} as PersistedTablesIndex);
    }
  }

  public async writeTable(table: DbmsTable) {
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

  private static createColumns(columns: PersistedColumn[]): DbmsColumn[] {
    return columns.map(({ id, name, tableId, type }) => new DbmsColumn({ id, name, tableId, type }));
  }

  private static createTable(table: PersistedTable, columns: DbmsColumn[]): DbmsTable {
    const { id, name, databaseId } = table;
    return new DbmsTable({ id, name, databaseId, columns });
  }

  private static createDatabase(database: PersistedDatabase, tables: DbmsTable[]): DbmsDatabase {
    const { id, name } = database;
    return new DbmsDatabase({ id, name, tables });
  }
}

export default DbmsPersistor;
