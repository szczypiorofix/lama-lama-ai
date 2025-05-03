import { Dispatch } from 'react';

import { APP_VIEW } from '../shared/enums';
import { LlmImageList } from '../shared/models';

export interface AppStateModel {
    isSideNavOpen: boolean;
    llms: LlmImageList;
    view: APP_VIEW;
}

export interface AppContextModel {
    state: AppStateModel;
    dispatch: Dispatch<Action>;
}

export type Action =
    | { type: 'CHANGE_LLM_LIST'; payload: LlmImageList }
    | { type: 'SIDENAV_TOGGLE', payload: boolean }
    | { type: 'CHANGE_VIEW', payload: APP_VIEW };
