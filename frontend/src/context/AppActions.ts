import { Dispatch } from 'react';

import { APP_VIEW } from '../shared/enums';
import { BackgroundTask, LlmImage } from '../shared/models';

import { Action } from './types';

export function changeAppView(dispatch: Dispatch<Action>, view: APP_VIEW) {
    dispatch({ type: 'CHANGE_VIEW', payload: view });
}

export function toggleSideNav(dispatch: Dispatch<Action>, open: boolean) {
    dispatch({ type: 'SIDENAV_TOGGLE', payload: open });
}

export function changeLlmList(dispatch: Dispatch<Action>, list: LlmImage[]) {
    dispatch({ type: 'CHANGE_LLM_LIST', payload: list });
}

export function setBackgroundTask(dispatch: Dispatch<Action>, task: BackgroundTask<unknown>) {
    dispatch({ type: 'ADD_BACKGROUND_TASK', payload: task });
}
