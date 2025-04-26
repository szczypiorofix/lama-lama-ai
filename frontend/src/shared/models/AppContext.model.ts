import { APP_VIEW } from '../enums';

import { LlmImageList } from './LlmImage.model.ts';

export interface AppStateModel {
    isSideNavOpen: boolean;
    llms: LlmImageList;
    view: APP_VIEW;
}

export interface AppContextModel {
    contextState: AppStateModel;
    setContextState: (state: AppStateModel) => void;
}
