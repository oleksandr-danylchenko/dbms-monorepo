import { denormalize, normalize } from '@utils/normalization.helper';
import Database from '@models/dbms/database';
import DbmsPersistor from '@services/dbms/dbmsPersitor.service';
import { HttpException } from '@exceptions/HttpException';

class DbmsService {
  public dbmsPersistor = new DbmsPersistor();
  public databasesIndex: {
    [databaseId: string]: Database;
  };

  constructor() {
    const databases = this.dbmsPersistor.readDatabases();
    this.databasesIndex = normalize(databases);
  }

  public findAllDatabases(): Promise<Database[]> {
    return Promise.resolve(denormalize(this.databasesIndex));
  }

  public findDatabaseById(databaseId: string): Promise<Database> {
    const database = this.databasesIndex[databaseId];
    if (!database) throw new HttpException(404, `No database ${databaseId} found`);
    return Promise.resolve(database);
  }
}

export default DbmsService;
