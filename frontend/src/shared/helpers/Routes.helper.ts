import { routes } from '../constants';
import { APP_VIEW } from '../enums';
import { Route } from '../models';

export function getAllRoutesAsList(): Route[] {
    return Object.entries(routes).map(([, route]) => route);
}

export function getRoute(view: APP_VIEW): Route {
    return routes[view];
}
