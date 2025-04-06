import { JSX } from 'react';

import {Box, Container, Divider} from '@mui/material';

import { Home } from "../../pages";
import { Footer } from '../footer/Footer.tsx';
import { ToolBar } from '../toolbar/ToolBar.tsx';

export function ViewPort(): JSX.Element {
    return (
        <Box>
            <ToolBar />
            <Container maxWidth='lg'>
                <Home />
            </Container>
            <Box mt={3}></Box>
            <Divider/>
            <Footer>
                Lama Lama AI
            </Footer>
        </Box>
    );
}
