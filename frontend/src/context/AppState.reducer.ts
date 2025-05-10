import { BackgroundTask } from '../shared/models';

import { Action, AppStateModel } from './types.ts';

export function appContextReducer(
    state: AppStateModel,
    action: Action
): AppStateModel {
    switch (action.type) {
        case 'SIDENAV_TOGGLE':
            return { ...state, isSideNavOpen: action.payload };
        case 'CHANGE_VIEW':
            return { ...state, view: action.payload };
        case 'CHANGE_LLM_LIST':
            return { ...state, llms: action.payload };
        case 'ADD_BACKGROUND_TASK': {
            const backgroundTask: BackgroundTask<unknown> = action.payload;
            return { ...state, backgroundTask };
        }
        default:
            return state;
    }
}
