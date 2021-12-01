export const API = {
  DATABASES: '/databases',
  DATABASE: (databaseId: string): string => `${API.DATABASES}/${databaseId}`,

  TABLES: (databaseId: string): string => `${API.DATABASE(databaseId)}/tables`,
  TABLE: (databaseId: string, tableId: string): string => `${API.TABLES(databaseId)}/${tableId}`,

  COLUMNS: (databaseId: string, tableId: string): string => `${API.TABLE(databaseId, tableId)}/columns`,
  COLUMN: (databaseId: string, tableId: string, columnId: string): string =>
    `${API.COLUMNS(databaseId, tableId)}/${columnId}`,

  ROWS: (databaseId: string, tableId: string): string => `${API.TABLE(databaseId, tableId)}/rows`,
  ROWS_PROJECTION: (databaseId: string, tableId: string): string => `${API.ROWS(databaseId, tableId)}/projection`,
  ROW: (databaseId: string, tableId: string, rowId: string): string => `${API.ROWS(databaseId, tableId)}/${rowId}`,
};
