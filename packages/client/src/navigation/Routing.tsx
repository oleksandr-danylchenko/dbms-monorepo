import { FC } from 'react';
import { createBrowserHistory } from 'history';
import { Redirect, Route, Switch } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import Databases from '../pages/Databases';
import Tables from '../pages/Tables';

const ROUTE_POSTFIX = '| Dbms';

const Routing: FC = () => (
  <Switch>
    <PublicRoute exact path="/databases" title={`Databases ${ROUTE_POSTFIX}`} component={Databases} />
    <PublicRoute exact path="/databases/:databaseId/tables" title={`Tables ${ROUTE_POSTFIX}`} component={Tables} />
    <Route path="/*">
      <Redirect to="/databases" />
    </Route>
  </Switch>
);

export const history = createBrowserHistory();

export default Routing;
