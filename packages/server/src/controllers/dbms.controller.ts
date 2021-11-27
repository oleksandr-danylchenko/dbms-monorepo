import { NextFunction, Request, Response } from 'express';
import DbmsService from '@services/dbms/dbms.service';
import Database from '@models/dbms/database';
import { CreateDatabaseDto, DatabaseDto } from '@dtos/database.dto';
import DatabaseMapper from '@/mappers/database.mapper';
import Table from '@models/dbms/table';
import { TableDto } from '@dtos/table.dto';
import TableMapper from '@/mappers/table.mapper';

class DbmsController {
  public dbmsService = new DbmsService();

  public getDatabases = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const databases: Database[] = await this.dbmsService.findAllDatabases();
      const databasesDtos: DatabaseDto[] = databases.map(DatabaseMapper.toDto);

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
      const databaseData: CreateDatabaseDto = req.body;
      const createdDatabase: Database = await this.dbmsService.createDatabase(databaseData);
      const createdDatabaseDto = DatabaseMapper.toDto(createdDatabase);

      res.status(201).json({ data: createdDatabaseDto, message: 'createDatabase' });
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
      const tables: Table[] = await this.dbmsService.findAllTablesByDatabaseId(databaseId);
      const tablesDtos: TableDto[] = tables.map(TableMapper.toDto);

      res.status(200).json({ data: tablesDtos, message: 'findAllTables' });
    } catch (error) {
      next(error);
    }
  };

  public getTableById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
    } catch (error) {
      next(error);
    }
  };

  public createTable = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
    } catch (error) {
      next(error);
    }
  };

  public deleteTable = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
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
