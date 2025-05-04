import { Dispatch } from 'react';

import { APP_VIEW } from '../shared/enums';
import { LlmImage } from '../shared/models';

export interface AppStateModel {
    isSideNavOpen: boolean;
    llms: LlmImage[];
    view: APP_VIEW;
}

export interface AppContextModel {
    state: AppStateModel;
    dispatch: Dispatch<Action>;
}

export type Action =
    | { type: 'CHANGE_LLM_LIST'; payload: LlmImage[] }
    | { type: 'SIDENAV_TOGGLE', payload: boolean }
    | { type: 'CHANGE_VIEW', payload: APP_VIEW };
