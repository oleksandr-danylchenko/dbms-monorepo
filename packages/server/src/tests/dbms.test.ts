import request from 'supertest';
import App from '@/app';
import DbmsRoute from '@routes/dbms.route';
import DbmsService from '@services/dbms/dbms.service';
import DatabaseMapper from '@/mappers/database.mapper';
import { CreateDatabaseDto } from '@dtos/database.dto';
import { FieldType } from '@interfaces/dbms/dbms.interface';
import { CreateRowDto } from '@dtos/row.dto';

beforeAll(async () => {
  const dbmsService = new DbmsService();
  const databases = dbmsService.allDatabases;
  let testDatabase = databases.find((database) => database.name === 'testDatabase');
  if (!testDatabase) {
    testDatabase = await dbmsService.createDatabase({ name: 'testDatabase' });
  }
  const tables = testDatabase.tables;
  let testTable = tables.find((table) => table.name === 'testTable');
  if (!testTable) {
    testTable = await dbmsService.createTable(testDatabase.id, {
      name: 'testTable',
      columns: [
        { name: 'testColumn1', type: FieldType.string, orderIndex: 0 },
        { name: 'testColumn2', type: FieldType.char, orderIndex: 1 },
        { name: 'testColumn3', type: FieldType.real, orderIndex: 2 },
      ],
    });
  }

  const testColumnsIndex = testTable.columnsIndex;

  const rows = await dbmsService.findAllRows(testDatabase.id, testTable.id);
  if (!rows.length) {
    const testRowData: CreateRowDto = {
      columnsValuesIndex: Object.values(testColumnsIndex).reduce((colIndex, column) => {
        const columnId = column.id;
        const columnType = column.type;

        let value;
        switch (columnType) {
          case FieldType.string: {
            value = 'Testing string';
            break;
          }
          case FieldType.char: {
            value = 'g';
            break;
          }
          default: {
            value = 1.2;
            break;
          }
        }

        colIndex[columnId] = { columnId, value };
        return colIndex;
      }, {} as CreateRowDto['columnsValuesIndex']),
    };

    await dbmsService.createRow(testDatabase.id, testTable.id, testRowData);
  }
});

afterAll(async () => {
  await new Promise<void>((resolve) => setTimeout(() => resolve(), 100));
});

describe('Testing Databases', () => {
  describe('[GET] /databases', () => {
    it('response findAllDatabases', (done) => {
      const dbmsRoute = new DbmsRoute();
      const app = new App([dbmsRoute]);

      const dbmsService = new DbmsService();
      const databases = dbmsService.allDatabases;
      const databasesAmount = databases.length;

      request(app.getServer())
        .get(`${dbmsRoute.path}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);

          const { body } = res;
          if (body.message !== 'findAllDatabases') {
            throw new Error('Missing findAllDatabases message');
          }
          if (!Array.isArray(body.data)) {
            throw new Error('Databases are not in an array');
          }
          if (body.data.length !== databasesAmount) {
            throw new Error(`Databases amount is mismatched, expected: ${databasesAmount}, got: ${body.data.length}`);
          }
          return done();
        });
    });
  });

  describe('[GET] /databases/:dbId', () => {
    it('response findOne database', (done) => {
      const dbmsRoute = new DbmsRoute();
      const app = new App([dbmsRoute]);

      const dbmsService = new DbmsService();
      const databases = dbmsService.allDatabases;
      if (!databases.length) {
        done('No databases have been created yet');
      }
      const firstDatabase = databases[0];
      const firstDatabaseDto = DatabaseMapper.toDto(firstDatabase);

      request(app.getServer())
        .get(`${dbmsRoute.path}/${firstDatabaseDto.id}`)
        .expect('Content-Type', /json/)
        .expect(200, { data: firstDatabaseDto, message: 'findDatabaseById' }, done);
    });
  });

  describe('[POST] /databases', () => {
    it('response Create database duplicated name', (done) => {
      const dbmsRoute = new DbmsRoute();
      const app = new App([dbmsRoute]);

      const dbmsService = new DbmsService();
      const databases = dbmsService.allDatabases;
      if (!databases.length) {
        done('No databases have been created yet');
      }

      const firstDatabase = databases[0];
      const databaseData: CreateDatabaseDto = {
        name: firstDatabase.name,
      };

      request(app.getServer())
        .post(`${dbmsRoute.path}`)
        .send(databaseData)
        .expect('Content-Type', /json/)
        .expect(409, done);
    });
  });
});
