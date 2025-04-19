import { JSX } from 'react';

import { APP_VIEW } from '../enums';

export interface Route {
    name: string;
    view: APP_VIEW;
    page: JSX.Element;
    icon: JSX.Element;
}
