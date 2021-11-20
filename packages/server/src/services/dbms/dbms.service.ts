import DbmsPersistor from '@services/dbms/dbmsPersistor';
import DbmsDatabase from '@services/dbms/dbmsDatabase';
import { normalize } from '@utils/normalization.helper';

class DbmsService {
  public dbmsPersistor = new DbmsPersistor();
  public databasesIndex: {
    [databaseId: string]: DbmsDatabase;
  };

  constructor() {
    const databases = this.dbmsPersistor.readDatabases();
    this.databasesIndex = normalize(databases);
  }
}

export default DbmsService;
