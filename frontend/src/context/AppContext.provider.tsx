import {JSX, PropsWithChildren, useReducer} from 'react';

import { defaultAppState } from '../shared/constants';

import {AppContext, appContextReducer} from './AppContext.tsx';

export function AppContextProvider(props: PropsWithChildren): JSX.Element {
    const [state, dispatch] = useReducer(appContextReducer, defaultAppState);
    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {props.children}
        </AppContext.Provider>
    );
}
