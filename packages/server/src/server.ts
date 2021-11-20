import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UsersRoute from '@routes/users.route';
import DbmsRoute from '@routes/dbms.route';

const app = new App([new IndexRoute(), new UsersRoute(), new AuthRoute(), new DbmsRoute()]);

app.listen();
