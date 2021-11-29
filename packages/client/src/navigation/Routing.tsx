import { FC } from 'react';
import { createBrowserHistory } from 'history';
import { Redirect, Route, Switch } from 'react-router-dom';
import PublicRoute from './PublicRoute';

const ROUTE_POSTFIX = '| Dbms';

const testElement: FC = () => <h1>Hello, Im a route</h1>;

const Routing: FC = () => (
  <Switch>
    <PublicRoute exact path="/" title={`Databases ${ROUTE_POSTFIX}`} component={testElement} />
    <Route path="/*">
      <Redirect to="/" />
    </Route>
  </Switch>
);

export const history = createBrowserHistory();

export default Routing;
