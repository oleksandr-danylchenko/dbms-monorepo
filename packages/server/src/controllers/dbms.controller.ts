import { NextFunction, Request, Response } from 'express';
import DbmsService from '@services/dbms/dbms.service';
import DatabaseMapper from '@/mappers/database.mapper';
import TableMapper from '@/mappers/table.mapper';
import ColumnMapper from '@/mappers/column.mapper';
import RowMapper from '@/mappers/row.mapper';

class DbmsController {
  public dbmsService = new DbmsService();

  public getDatabases = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const databases = await this.dbmsService.findAllDatabases();
      const databasesDtos = databases.map(DatabaseMapper.toDto);

      res.status(200).json({ data: databasesDtos, message: 'findAllDatabases' });
    } catch (error) {
      next(error);
    }
  };

  public getDatabaseById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const databaseId = req.params.dbId;
      const database = await this.dbmsService.findDatabaseById(databaseId);
      const databaseDto = DatabaseMapper.toDto(database);

      res.status(200).json({ data: databaseDto, message: 'findDatabaseById' });
    } catch (error) {
      next(error);
    }
  };

  public createDatabase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const databaseData = req.body;
      const createdDatabase = await this.dbmsService.createDatabase(databaseData);
      const createdDatabaseDto = DatabaseMapper.toDto(createdDatabase);

      res.status(201).json({ data: createdDatabaseDto, message: 'createDatabase' });
    } catch (error) {
      next(error);
    }
  };

  public updateDatabase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const databaseId = req.params.dbId;
      const databaseData = req.body;
      const updatedDatabase = await this.dbmsService.updateDatabase(databaseId, databaseData);
      const updatedDatabaseDto = DatabaseMapper.toDto(updatedDatabase);

      res.status(201).json({ data: updatedDatabaseDto, message: 'updateDatabase' });
    } catch (error) {
      next(error);
    }
  };

  public deleteDatabase = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const databaseId = req.params.dbId;
      await this.dbmsService.deleteDatabase(databaseId);

      res.status(200).json({ data: { id: databaseId }, message: 'deleteDatabase' });
    } catch (error) {
      next(error);
    }
  };

  public getTables = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const databaseId = req.params.dbId;
      const tables = await this.dbmsService.findAllTablesByDatabaseId(databaseId);
      const tablesDtos = tables.map(TableMapper.toDto);

      res.status(200).json({ data: tablesDtos, message: 'findAllTables' });
    } catch (error) {
      next(error);
    }
  };

  public getTableById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const databaseId = req.params.dbId;
      const tableId = req.params.tableId;
      const table = await this.dbmsService.findTableById(databaseId, tableId);
      const tableDto = TableMapper.toDto(table);

      res.status(200).json({ data: tableDto, message: 'findTableById' });
    } catch (error) {
      next(error);
    }
  };

  public createTable = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const databaseId = req.params.dbId;
      const tableData = req.body;
      const createdTable = await this.dbmsService.createTable(databaseId, tableData);
      const createdTableDto = TableMapper.toDto(createdTable);

      res.status(201).json({ data: createdTableDto, message: 'createTable' });
    } catch (error) {
      next(error);
    }
  };

  public updateTable = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const databaseId = req.params.dbId;
      const tableId = req.params.tableId;
      const tableData = req.body;
      const updatedTable = await this.dbmsService.updateTable(databaseId, tableId, tableData);
      const updatedTableDto = TableMapper.toDto(updatedTable);

      res.status(200).json({ data: updatedTableDto, message: 'updateTable' });
    } catch (error) {
      next(error);
    }
  };

  public deleteTable = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const databaseId = req.params.dbId;
      const tableId = req.params.tableId;
      await this.dbmsService.deleteTable(databaseId, tableId);

      res.status(200).json({ data: { id: tableId, databaseId }, message: 'deleteTable' });
    } catch (error) {
      next(error);
    }
  };

  public getColumns = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const databaseId = req.params.dbId;
      const tableId = req.params.tableId;
      const columns = await this.dbmsService.findAllColumns(databaseId, tableId);
      const columnsDtos = columns.map(ColumnMapper.toDto);

      res.status(200).json({ data: columnsDtos, message: 'findAllColumns' });
    } catch (error) {
      next(error);
    }
  };

  public getColumnById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const databaseId = req.params.dbId;
      const tableId = req.params.tableId;
      const columnId = req.params.columnId;
      const column = await this.dbmsService.findColumnById(databaseId, tableId, columnId);
      const columnDto = ColumnMapper.toDto(column);

      res.status(200).json({ data: columnDto, message: 'findColumnById' });
    } catch (error) {
      next(error);
    }
  };

  public createColumn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const databaseId = req.params.dbId;
      const tableId = req.params.tableId;
      const columnData = req.body;
      const createdColumn = await this.dbmsService.createColumn(databaseId, tableId, columnData);
      const createdColumnDto = ColumnMapper.toDto(createdColumn);

      res.status(201).json({ data: createdColumnDto, message: 'createColumn' });
    } catch (error) {
      next(error);
    }
  };

  public updateColumn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const databaseId = req.params.dbId;
      const tableId = req.params.tableId;
      const columnId = req.params.columnId;
      const columnData = req.body;
      const updatedColumn = await this.dbmsService.updateColumn(databaseId, tableId, columnId, columnData);
      const updatedColumnDto = ColumnMapper.toDto(updatedColumn);

      res.status(200).json({ data: updatedColumnDto, message: 'updateColumn' });
    } catch (error) {
      next(error);
    }
  };

  public deleteColumn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const databaseId = req.params.dbId;
      const tableId = req.params.tableId;
      const columnId = req.params.columnId;
      await this.dbmsService.deleteColumn(databaseId, tableId, columnId);

      res.status(200).json({ data: { id: columnId, databaseId, tableId }, message: 'deleteColumn' });
    } catch (error) {
      next(error);
    }
  };

  public getRows = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const databaseId = req.params.dbId;
      const tableId = req.params.tableId;
      const rows = await this.dbmsService.findAllRows(databaseId, tableId);
      const rowsDtos = rows.map(RowMapper.toDto);

      res.status(200).json({ data: rowsDtos, message: 'findAllRows' });
    } catch (error) {
      next(error);
    }
  };

  public getRowsProjection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const databaseId = req.params.dbId;
      const tableId = req.params.tableId;
      const projectionColumnsIds = JSON.parse(req.query.columns as string);
      const rows = await this.dbmsService.projectRows(databaseId, tableId, projectionColumnsIds);
      const rowsDtos = rows.map(RowMapper.toDto);

      res.status(200).json({ data: rowsDtos, message: 'projectRows' });
    } catch (error) {
      next(error);
    }
  };

  public createRow = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const databaseId = req.params.dbId;
      const tableId = req.params.tableId;
      const rowData = req.body;
      const createdRow = await this.dbmsService.createRow(databaseId, tableId, rowData);
      const createdRowDto = RowMapper.toDto(createdRow);

      res.status(201).json({ data: createdRowDto, message: 'createRow' });
    } catch (error) {
      next(error);
    }
  };

  public deleteRow = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const databaseId = req.params.dbId;
      const tableId = req.params.tableId;
      const rowId = req.params.rowId;
      await this.dbmsService.deleteRow(databaseId, tableId, rowId);

      res.status(200).json({ data: { id: rowId, databaseId, tableId }, message: 'deleteRow' });
    } catch (error) {
      next(error);
    }
  };
}

export default DbmsController;
