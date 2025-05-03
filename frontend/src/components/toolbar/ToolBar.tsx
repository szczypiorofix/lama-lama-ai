import { JSX } from 'react';

import MenuIcon from '@mui/icons-material/Menu';
import { Box } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { useGlobalAppContext } from '../../context/AppContext.tsx';
import { getRoute } from '../../shared/helpers';
import { toggleSideNav } from '../../context/AppActions.ts';

export function ToolBar(): JSX.Element {
    const { state, dispatch } = useGlobalAppContext();
    const currentPageTitle = getRoute(state.view).name;
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position='static'>
                <Toolbar>
                    <IconButton
                        size='large'
                        edge='start'
                        color='inherit'
                        aria-label='menu'
                        sx={{ mr: 2 }}
                        onClick={() => toggleSideNav(dispatch, true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant='h6'
                        component='div'
                        sx={{ flexGrow: 1 }}
                    >
                        {currentPageTitle}
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
