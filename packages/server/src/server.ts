import App from '@/app';
import IndexRoute from '@routes/index.route';
import DbmsRoute from '@routes/dbms.route';

const app = new App([new IndexRoute(), new DbmsRoute()]);

app.listen();
