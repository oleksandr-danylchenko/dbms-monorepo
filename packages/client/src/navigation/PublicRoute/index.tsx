import { ElementType, FC } from 'react';
import { Route } from 'react-router-dom';
import { match, RouteProps } from 'react-router';

export interface PublicRouteProps extends Omit<RouteProps, 'component'> {
  component: ElementType;
  computedMatch?: match<{ courseId: string }>;
  title?: string;
}

const PublicRoute: FC<PublicRouteProps> = ({ component: Component, title, ...routeProps }) => {
  return (
    <Route
      {...routeProps}
      render={(renderRouteProps) => {
        if (title) document.title = title;
        return <Component {...renderRouteProps} />;
      }}
    />
  );
};

export default PublicRoute;
