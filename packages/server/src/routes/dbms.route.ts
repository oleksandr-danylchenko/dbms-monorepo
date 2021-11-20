import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import DbmsController from '@controllers/dbms.controller';

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
    this.router.delete(`${this.path}/:dbId`, this.dbmsController.deleteDatabase);

    this.router.get(`${this.path}/:dbId/tables`, this.dbmsController.getTables);
    this.router.get(`${this.path}/:dbId/tables/:tableId`, this.dbmsController.getTableById);
    this.router.post(`${this.path}/:dbId/tables`, this.dbmsController.createTable);
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
