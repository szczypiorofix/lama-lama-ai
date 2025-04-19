import { JSX } from 'react';

import { ViewPort } from './components/viewport/ViewPort.tsx';
import { AppContextProvider } from './context/AppContext.provider.tsx';

function App(): JSX.Element {
    return <AppContextProvider>
        <ViewPort />;
    </AppContextProvider>
}

export default App;
