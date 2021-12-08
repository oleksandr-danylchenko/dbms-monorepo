import request from 'supertest';
import App from '@/app';
import DbmsRoute from '@routes/dbms.route';
import DbmsService from '@services/dbms/dbms.service';
import DatabaseMapper from '@/mappers/database.mapper';
import { CreateDatabaseDto } from '@dtos/database.dto';
import { FieldType } from '@interfaces/dbms/dbms.interface';
import { CreateRowDto } from '@dtos/row.dto';
import { UpdateTableDto } from '@dtos/table.dto';
import { UpdateColumnDto } from '@dtos/column.dto';

beforeAll(async () => {
  const dbmsService = DbmsService.getInstance();
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
  const dbmsService = DbmsService.getInstance();
  const databases = dbmsService.allDatabases;
  const testDatabase = databases.find((database) => database.name === 'testDatabase');
  if (!testDatabase) return;
  await dbmsService.deleteDatabase(testDatabase.id);
});

describe('Testing Databases', () => {
  describe('[GET] /databases', () => {
    it('response findAllDatabases', (done) => {
      const dbmsRoute = new DbmsRoute();
      const app = new App([dbmsRoute]);

      const dbmsService = DbmsService.getInstance();
      const databases = dbmsService.allDatabases;
      const databasesAmount = databases.length;

      request(app.getServer())
        .get(`${dbmsRoute.path}`)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
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
        })
        .end((err) => {
          if (err) return done(err);
          return done();
        });
    });
  });

  describe('[GET] /databases/:dbId', () => {
    it('response findOne database', async () => {
      const dbmsRoute = new DbmsRoute();
      const app = new App([dbmsRoute]);

      const dbmsService = DbmsService.getInstance();
      const databases = dbmsService.allDatabases;
      const testDatabase = databases.find((database) => database.name === 'testDatabase');
      if (!testDatabase) {
        throw new Error('Missing testDatabase');
      }
      const testDatabaseDto = DatabaseMapper.toDto(testDatabase);

      return request(app.getServer())
        .get(`${dbmsRoute.path}/${testDatabaseDto.id}`)
        .expect('Content-Type', /json/)
        .expect(200, { data: testDatabaseDto, message: 'findDatabaseById' });
    });
  });

  describe('[POST] /databases', () => {
    it('response Create database duplicated name', async () => {
      const dbmsRoute = new DbmsRoute();
      const app = new App([dbmsRoute]);

      const dbmsService = DbmsService.getInstance();
      const databases = dbmsService.allDatabases;
      const testDatabase = databases.find((database) => database.name === 'testDatabase');
      if (!testDatabase) {
        throw new Error('Missing testDatabase');
      }
      const databaseData: CreateDatabaseDto = {
        name: testDatabase.name,
      };

      return request(app.getServer())
        .post(`${dbmsRoute.path}`)
        .send(databaseData)
        .expect('Content-Type', /json/)
        .expect(409);
    });
  });

  describe('[GET] /databases/:dbId/tables/:tableId/rows/projection', () => {
    it('response table rows projection', (done) => {
      const dbmsRoute = new DbmsRoute();
      const app = new App([dbmsRoute]);

      const dbmsService = DbmsService.getInstance();
      const databases = dbmsService.allDatabases;
      const testDatabase = databases.find((database) => database.name === 'testDatabase');
      const tables = testDatabase?.tables;
      const testTable = tables?.find((table) => table.name === 'testTable');
      if (!testTable) {
        throw new Error('Missing testTable');
      }

      const projectionColumnsIds = testTable.columnsIds.slice(0, 2);
      const projectionColumnsIdsParam = JSON.stringify(projectionColumnsIds);

      request(app.getServer())
        .get(
          `${dbmsRoute.path}/${testDatabase?.id}/tables/${testTable.id}/rows/projection?columns=${projectionColumnsIdsParam}`
        )
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          const { body } = res;
          if (body.message !== 'projectRows') {
            throw new Error('Missing findAllDatabases message');
          }

          const rowsProjection = body.data;
          const firstRow = rowsProjection[0];
          const firstRowColumnsIds = Object.keys(firstRow.columnsValuesIndex);
          const firstRowColumnsAmount = firstRowColumnsIds.length;
          if (firstRowColumnsAmount !== 2) {
            throw new Error('Amount of projected columns is mismatched');
          }

          const isColumnsMatching = projectionColumnsIds.every((columnId) => firstRowColumnsIds.includes(columnId));
          if (!isColumnsMatching) {
            throw new Error(
              `Projected columns ids ${firstRowColumnsIds} missing expected columns ids ${projectionColumnsIds}`
            );
          }
        })
        .end((err) => {
          if (err) return done(err);
          return done();
        });
    });
  });

  describe('[PUT] /databases/:dbId/tables/:tableId', () => {
    it('rename and reorder columns', (done) => {
      const dbmsRoute = new DbmsRoute();
      const app = new App([dbmsRoute]);

      const dbmsService = DbmsService.getInstance();
      const databases = dbmsService.allDatabases;
      const testDatabase = databases.find((database) => database.name === 'testDatabase');
      const tables = testDatabase?.tables;
      const testTable = tables?.find((table) => table.name === 'testTable');
      const testColumns = testTable?.columns;
      if (!testColumns?.length) {
        throw new Error('Missing columns for the testTable');
      }

      const firstColumn = testColumns[0];
      const secondColumn = testColumns[1];

      const updateFirstColumn: UpdateColumnDto = {
        id: firstColumn.id,
        name: 'updatedFirstColumn',
        orderIndex: secondColumn.orderIndex,
      };

      const updateSecondColumn: UpdateColumnDto = {
        id: secondColumn.id,
        name: 'updatedSecondColumn',
        orderIndex: firstColumn.orderIndex,
      };

      const updateData: UpdateTableDto = {
        columns: [updateFirstColumn, updateSecondColumn],
      };

      request(app.getServer())
        .put(`${dbmsRoute.path}/${testDatabase?.id}/tables/${testTable?.id}`)
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
          const { body } = res;
          if (body.message !== 'updateTable') {
            throw new Error('Missing updateTable message');
          }

          const updatedTable = body.data;
          const updatedColumnsIndex = updatedTable.columnsIndex;

          const updatedFirstColumn = updatedColumnsIndex[firstColumn.id];
          if (!updatedFirstColumn) {
            throw new Error(`Missing updated first column ${firstColumn.id}`);
          }
          const isFirstNameUpdated = updatedFirstColumn.name === updateFirstColumn.name;
          if (!isFirstNameUpdated) {
            throw new Error(`First column name wasn't updated to ${updateFirstColumn.name}`);
          }
          const isFirstOrderUpdated = updatedFirstColumn.orderIndex === updateFirstColumn.orderIndex;
          if (!isFirstOrderUpdated) {
            throw new Error(`First column order wasn't updated to ${updateFirstColumn.orderIndex}`);
          }

          const updatedSecondColumn = updatedColumnsIndex[secondColumn.id];
          if (!updatedSecondColumn) {
            throw new Error(`Missing updated second column ${secondColumn.id}`);
          }
          const isSecondNameUpdated = updatedSecondColumn.name === updateSecondColumn.name;
          if (!isSecondNameUpdated) {
            throw new Error(`Second column name wasn't updated to ${updateSecondColumn.name}`);
          }
          const isSecondOrderUpdated = updatedSecondColumn.orderIndex === updateSecondColumn.orderIndex;
          if (!isSecondOrderUpdated) {
            throw new Error(`Second column order wasn't updated to ${updateSecondColumn.orderIndex}`);
          }
        })
        .end((err) => {
          if (err) return done(err);
          return done();
        });
    });
  });
});
