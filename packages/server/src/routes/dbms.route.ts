import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import DbmsController from '@controllers/dbms.controller';
import validationMiddleware from '@middlewares/validation.middleware';
import { CreateDatabaseDto, UpdateDatabaseDto } from '@dtos/database.dto';
import { CreateTableDto, UpdateTableDto } from '@dtos/table.dto';

class DbmsRoute implements Routes {
  public path = '/databases';
  public router = Router();
  public dbmsController = new DbmsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.dbmsController.getDatabases);
    this.router.get(`${this.path}/:dbId`, this.dbmsController.getDatabaseById);
    this.router.post(
      `${this.path}`,
      validationMiddleware(CreateDatabaseDto, 'body'),
      this.dbmsController.createDatabase
    );
    this.router.put(
      `${this.path}/:dbId`,
      validationMiddleware(UpdateDatabaseDto, 'body', true),
      this.dbmsController.updateDatabase
    );
    this.router.delete(`${this.path}/:dbId`, this.dbmsController.deleteDatabase);

    this.router.get(`${this.path}/:dbId/tables`, this.dbmsController.getTables);
    this.router.get(`${this.path}/:dbId/tables/:tableId`, this.dbmsController.getTableById);
    this.router.post(
      `${this.path}/:dbId/tables`,
      validationMiddleware(CreateTableDto, 'body'),
      this.dbmsController.createTable
    );
    this.router.put(
      `${this.path}/:dbId/tables/:tableId`,
      validationMiddleware(UpdateTableDto, 'body', true),
      this.dbmsController.updateTable
    );
    this.router.delete(`${this.path}/:dbId/tables/:tableId`, this.dbmsController.deleteTable);

    this.router.get(`${this.path}/:dbId/tables/:tableId/records`, this.dbmsController.getTableRecords);
    this.router.get(
      `${this.path}/:dbId/tables/:tableId/records/projection`,
      this.dbmsController.getTableRecordsProjection
    );
    this.router.post(`${this.path}/:dbId/tables/records`, this.dbmsController.createTableRecordById);
    this.router.put(`${this.path}/:dbId/tables/:tableId/records/:recordId`, this.dbmsController.updateTableRecord);
    this.router.delete(`${this.path}/:dbId/tables/:tableId/records/:recordId`, this.dbmsController.deleteTableRecord);
  }
}

export default DbmsRoute;
