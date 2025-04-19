import { APP_VIEW } from '../enums';

export interface AppStateModel {
    isSideNavOpen: boolean;
    view: APP_VIEW;
}

export interface AppContextModel {
    contextState: AppStateModel;
    setContextState: (state: AppStateModel) => void;
}
