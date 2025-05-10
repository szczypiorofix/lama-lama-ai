import { createContext, useContext } from 'react';

import { APP_VIEW } from '../shared/enums';

import { AppContextModel, AppStateModel } from "./types.ts";

export const defaultAppStateContext: AppStateModel = {
    llms: [],
    view: APP_VIEW.HOME,
    isSideNavOpen: false,
    backgroundTask: null,
}

export const AppContext = createContext<AppContextModel>({
    state: defaultAppStateContext,
    dispatch: () => {}
});

export const useGlobalAppContext = () => useContext(AppContext);
