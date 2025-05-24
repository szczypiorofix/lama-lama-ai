import { JSX } from 'react';

import {
    Box,
    Divider,
    Drawer,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import Typography from '@mui/material/Typography';

import localLlamaImage from '../../assets/images/local_llama.jpg';
import { changeAppView, toggleSideNav } from '../../context/AppActions.ts';
import { useGlobalAppContext } from '../../context/AppContext.tsx';
import { getAllRoutesAsList } from '../../shared/helpers';
import { Route } from '../../shared/models';

export function SideNav(): JSX.Element {
    const { state, dispatch } = useGlobalAppContext();

    const changeView = (route: Route) => {
        toggleSideNav(dispatch, false);
        changeAppView(dispatch, route.view);
    };

    const DrawerList = (
        <Box sx={{ width: 260 }} role='presentation'>
            <Box sx={{ p: 2, textAlign: 'center', borderBottom: '1px solid #ccc' }}>
                <img src={localLlamaImage} alt="Logo Lama Lama AI" style={{ width: '100px' }} />
                <Typography variant="h6">Lama Lama AI</Typography>
            </Box>
            {getAllRoutesAsList().map((route, index) => (
                <ListItem key={index} disablePadding>
                    <ListItemButton
                        selected={route.view === state.view}
                        onClick={() => changeView(route)}
                    >
                        <ListItemIcon>{route.icon}</ListItemIcon>
                        <ListItemText primary={route.name} />
                    </ListItemButton>
                </ListItem>
            ))}
            <Divider />
        </Box>
    );

    return (
        <Drawer open={state.isSideNavOpen} onClose={() => toggleSideNav(dispatch, false)}>
            {DrawerList}
        </Drawer>
    );
}
