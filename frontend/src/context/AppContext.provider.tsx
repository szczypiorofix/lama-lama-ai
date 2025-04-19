import { JSX, PropsWithChildren, useState } from 'react';

import { defaultAppState } from '../shared/constants';
import { AppStateModel } from '../shared/models';

import { AppContext } from './AppContext.tsx';

export function AppContextProvider(props: PropsWithChildren): JSX.Element {
    const [contextState, setContextState] =
        useState<AppStateModel>(defaultAppState);
    return (
        <AppContext.Provider
            value={{
                contextState,
                setContextState: (state: AppStateModel) => {
                    setContextState({ ...contextState, ...state });
                },
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
}
