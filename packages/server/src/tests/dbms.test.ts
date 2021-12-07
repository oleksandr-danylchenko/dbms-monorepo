import request from 'supertest';
import App from '@/app';
import DbmsRoute from '@routes/dbms.route';
import DbmsService from '@services/dbms/dbms.service';
import DatabaseMapper from '@/mappers/database.mapper';

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
});
