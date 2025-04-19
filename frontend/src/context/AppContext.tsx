import { createContext, useContext } from 'react';

import { defaultAppContextState } from '../shared/constants';
import { AppContextModel } from '../shared/models';

export const AppContext = createContext<AppContextModel>(
    defaultAppContextState
);

export const useGlobalAppContext = () => useContext(AppContext);
