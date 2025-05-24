import { JSX } from 'react';

import {
    Box,
    Card,
    Paper,
} from '@mui/material';
import Typography from '@mui/material/Typography';

import { PanelTabs } from '../../components/tabs/PanelTabs.tsx';

import { LlmModels } from './LlmModels.tsx';
import { SpeakingModels } from './SpeakingModels.tsx';

export function Settings(): JSX.Element {

    return (
        <Box pt={2}>
            <Paper elevation={1}>
                <Card sx={{ padding: 1 }}>
                    <Box mt={2} mb={2}>
                        <Typography variant={'h5'}>SETTINGS</Typography>
                    </Box>

                    <PanelTabs
                        tabs={[
                            {
                                label: 'Local LLM models',
                                content: <LlmModels />,
                            },
                            {
                                label: 'Speaking models',
                                content: <SpeakingModels />,
                            }
                        ]}
                    ></PanelTabs>
                </Card>
            </Paper>
        </Box>
    );
}
