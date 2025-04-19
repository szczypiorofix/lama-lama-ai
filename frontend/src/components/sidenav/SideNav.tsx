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
import { useGlobalAppContext } from '../../context/AppContext.tsx';
import { Route } from '../../shared/models';
import { getAllRoutesAsList } from '../../shared/helpers';

export function SideNav(): JSX.Element {
    const { contextState, setContextState } = useGlobalAppContext();

    const toggleDrawer = (isOpen: boolean) => () => {
        setContextState({ ...contextState, isSideNavOpen: isOpen });
    };

    const changeView = (route: Route) => {
        setContextState({
            ...contextState,
            isSideNavOpen: false,
            view: route.view,
        });
    };

    const DrawerList = (
        <Box sx={{ width: 260 }} role='presentation'>
            <Box sx={{ width: 260 }}></Box>
            {getAllRoutesAsList().map((route, index) => (
                <ListItem key={index} disablePadding>
                    <ListItemButton
                        selected={route.view === contextState.view}
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
        <Drawer open={contextState.isSideNavOpen} onClose={toggleDrawer(false)}>
            {DrawerList}
        </Drawer>
    );
}
