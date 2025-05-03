import { createContext, useContext } from 'react';

import { defaultAppContextState } from "../shared/constants";

import { Action, AppContextModel, AppStateModel } from "./types.ts";

export const AppContext = createContext<AppContextModel>(defaultAppContextState);

export const useGlobalAppContext = () => useContext(AppContext);

export function appContextReducer(state: AppStateModel, action: Action): AppStateModel {
    switch (action.type) {
        case 'SIDENAV_TOGGLE':
            return { ...state, isSideNavOpen: action.payload };
        case 'CHANGE_VIEW':
            return { ...state, view: action.payload };
        case 'CHANGE_LLM_LIST':
            return { ...state, llms: action.payload };
            default:
            return state;
    }
}
