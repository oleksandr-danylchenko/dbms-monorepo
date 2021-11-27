import { NextFunction, Request, Response } from 'express';
import DbmsService from '@services/dbms/dbms.service';
import DatabaseMapper from '@/mappers/database.mapper';
import TableMapper from '@/mappers/table.mapper';

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

  public deleteTable = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const databaseId = req.params.dbId;
      const tableId = req.params.tableId;
      await this.dbmsService.deleteTable(databaseId, tableId);

      res.status(200).json({ data: { id: tableId, databaseId: databaseId }, message: 'deleteTable' });
    } catch (error) {
      next(error);
    }
  };

  public getTableRecords = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
    } catch (error) {
      next(error);
    }
  };

  public getTableRecordsProjection = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
    } catch (error) {
      next(error);
    }
  };

  public createTableRecordById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
    } catch (error) {
      next(error);
    }
  };

  public updateTableRecord = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
    } catch (error) {
      next(error);
    }
  };

  public deleteTableRecord = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
    } catch (error) {
      next(error);
    }
  };
}

export default DbmsController;
