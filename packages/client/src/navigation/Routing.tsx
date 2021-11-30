import { FC } from 'react';
import { createBrowserHistory } from 'history';
import { Redirect, Route, Switch } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import Databases from '../pages/Databases';

const ROUTE_POSTFIX = '| Dbms';

const Routing: FC = () => (
  <Switch>
    <PublicRoute exact path="/databases" title={`Databases ${ROUTE_POSTFIX}`} component={Databases} />
    <Route path="/*">
      <Redirect to="/databases" />
    </Route>
  </Switch>
);

export const history = createBrowserHistory();

export default Routing;
