import { JSX, PropsWithChildren, useReducer } from 'react';

import { AppContext, defaultAppStateContext } from './AppContext.tsx';
import { appContextReducer } from './AppState.reducer.ts';

export function AppContextProvider(props: PropsWithChildren): JSX.Element {
    const [state, dispatch] = useReducer(appContextReducer, defaultAppStateContext);
    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {props.children}
        </AppContext.Provider>
    );
}
