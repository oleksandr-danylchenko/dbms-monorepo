import fs, { promises as fsPromises } from 'fs';
import {
  PersistedColumn,
  PersistedColumnsIndex,
  PersistedDatabase,
  PersistedRow,
  PersistedTable,
  PersistedTablesIndex,
} from '@interfaces/dbms/persistedDbms.interface';
import Database from '@models/dbms/database';
import Table from '@models/dbms/table';
import Column from '@models/dbms/column';
import Row from '@models/dbms/row';
import { EOL } from 'os';

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
    const { id, name, databaseId, columns } = table;
    const tableFilePath = this.createTablePath(databaseId, id);
    const persistContent = {
      id,
      name,
      databaseId,
      columnsIndex: createPersistColumnsIndex(columns),
    };
    const persistContentStr = JSON.stringify(persistContent);
    return fsPromises.writeFile(tableFilePath, persistContentStr);

    function createPersistColumnsIndex(columns: Column[]): PersistedColumnsIndex {
      return columns.reduce((index, column) => {
        const { id: columnId, name: columnName, tableId, type: columnType, orderIndex: columnOrderIndex } = column;
        index[columnId] = { id: columnId, name: columnName, tableId, type: columnType, orderIndex: columnOrderIndex };
        return index;
      }, {} as PersistedColumnsIndex);
    }
  }

  public async deleteTable(table: Table) {
    const { id, databaseId } = table;
    const tableFilePath = this.createTablePath(databaseId, id);
    return fsPromises.unlink(tableFilePath);
  }

  private async readRowsLines(databaseId: string, tableId: string): Promise<PersistedRow[]> {
    const rowsFilePath = this.createRowsPath(databaseId, tableId);

    let rowsLines: string[] = [];
    try {
      const rowsFile = await fsPromises.readFile(rowsFilePath);
      rowsLines = rowsFile.toString().split(EOL).filter(Boolean);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fsPromises.writeFile(rowsFilePath, '');
      } else {
        throw error;
      }
    }
    return rowsLines.map((rowLine) => JSON.parse(rowLine));
  }

  public async readRows(databaseId: string, tableId: string): Promise<Row[]> {
    const rows = await this.readRowsLines(databaseId, tableId);
    return DbmsPersistor.createRows(rows);
  }

  public async readProjectedRows(databaseId: string, tableId: string, projectionColumnsIds: string[]): Promise<Row[]> {
    const rows = await this.readRowsLines(databaseId, tableId);
    const projectedPersistedRows = rows.map((row) => {
      const projectedColumnsIndex = projectionColumnsIds.reduce((columnsIndex, columnId) => {
        columnsIndex[columnId] = row.rowColumnsValuesIndex[columnId];
        return columnsIndex;
      }, {} as Record<string, any>);
      return { ...row, rowColumnsValuesIndex: projectedColumnsIndex };
    });
    return DbmsPersistor.createRows(projectedPersistedRows);
  }

  public async writeRow(databaseId: string, tableId: string, row: Row) {
    const { id, columnsValuesIndex } = row;
    const rowsFilePath = this.createRowsPath(databaseId, tableId);
    const persistContent = { id, tableId, rowColumnsValuesIndex: columnsValuesIndex };
    const persistContentStr = JSON.stringify(persistContent) + EOL;
    return fsPromises.writeFile(rowsFilePath, persistContentStr, { flag: 'a' });
  }

  public async deleteRowsColumn(databaseId: string, tableId: string, columnId: string) {
    const rows = await this.readRowsLines(databaseId, tableId);
    const rowsWithoutColumn = rows.map((row) => {
      const columnsValuesIndex = { ...row.rowColumnsValuesIndex };
      delete columnsValuesIndex[columnId];
      return { ...row, rowColumnsValuesIndex: columnsValuesIndex };
    });
    return this.writePersistedRows(databaseId, tableId, rowsWithoutColumn);
  }

  public async deleteRowsColumns(databaseId: string, tableId: string, columnsIds: string[]) {
    const rows = await this.readRowsLines(databaseId, tableId);
    const rowsWithoutColumn = rows.map((row) => {
      const columnsValuesIndex = { ...row.rowColumnsValuesIndex };
      columnsIds.forEach((columnId) => delete columnsValuesIndex[columnId]);
      return { ...row, rowColumnsValuesIndex: columnsValuesIndex };
    });
    return this.writePersistedRows(databaseId, tableId, rowsWithoutColumn);
  }

  public async removeRow(databaseId: string, tableId: string, rowId: string) {
    const rows = await this.readRowsLines(databaseId, tableId);
    const rowsWithoutRemoved = rows.filter((row) => row.id !== rowId);
    return this.writePersistedRows(databaseId, tableId, rowsWithoutRemoved);
  }

  private async writePersistedRows(databaseId: string, tableId: string, rows: PersistedRow[]) {
    const rowsFilePath = this.createRowsPath(databaseId, tableId);
    const persistContentStr = rows.map((row) => JSON.stringify(row)).join(EOL) + EOL;
    return fsPromises.writeFile(rowsFilePath, persistContentStr);
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

  private static createDatabase(database: PersistedDatabase, tables: Table[]): Database {
    const { id, name } = database;
    return new Database({ id, name, tables });
  }

  private static createTable(table: PersistedTable, columns: Column[]): Table {
    const { id, name, databaseId } = table;
    return new Table({ id, name, databaseId, columns });
  }

  private static createColumns(columns: PersistedColumn[]): Column[] {
    return columns.map(
      ({ id, name, tableId, type, orderIndex }) => new Column({ id, name, tableId, type, orderIndex })
    );
  }

  private static createRows(rows: PersistedRow[]): Row[] {
    return rows.map(
      ({ id, tableId, rowColumnsValuesIndex }) => new Row({ id, tableId, columnsValuesIndex: rowColumnsValuesIndex })
    );
  }
}

export default DbmsPersistor;
