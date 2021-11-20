import fs, { promises as fsPromises } from 'fs';
import DbmsDatabase, { TablesIndex } from '@services/dbms/dbmsDatabase';
import {
  PersistedColumn,
  PersistedDatabase,
  PersistedTable,
  PersistedTablesIndex,
} from '@interfaces/dbms/persistedDbms.interface';
import DbmsColumn from '@services/dbms/dbmsColumn';
import DbmsTable from '@services/dbms/dbmsTable';

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
    const databasesFiles = databasesFilenames.map((filename) => fs.readFileSync(filename));
    return databasesFiles.map((file) => JSON.parse(file.toString()) as PersistedDatabase);
  }

  private readDatabaseTablesFiles(database: PersistedDatabase): PersistedTable[] {
    const tablesIds = Object.keys(database.tablesIndex);
    const tablesFilesPaths = tablesIds.map((tableId) => `${this.tablesFolder}/${database.id}_${tableId}.json`);
    const tablesFiles = tablesFilesPaths.map((filename) => fs.readFileSync(filename));
    return tablesFiles.map((file) => JSON.parse(file.toString()) as PersistedTable);
  }

  public async writeDatabase(database: DbmsDatabase) {
    const { id, name, tablesIndex } = database;
    const databaseFilePath = `${this.databasesFolder}/${id}.json`;
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

  private static createColumns(columns: PersistedColumn[]): DbmsColumn[] {
    return columns.map(({ id, name, type }) => new DbmsColumn({ id, name, type }));
  }

  private static createTable(table: PersistedTable, columns: DbmsColumn[]): DbmsTable {
    const { id, name } = table;
    return new DbmsTable({ id, name, columns });
  }

  private static createDatabase(database: PersistedDatabase, tables: DbmsTable[]): DbmsDatabase {
    const { id, name } = database;
    return new DbmsDatabase({ id, name, tables });
  }
}

export default DbmsPersistor;
