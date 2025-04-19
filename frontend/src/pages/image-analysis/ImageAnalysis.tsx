import { JSX } from 'react';

import {
    Box,
    Card,
    Paper,
} from '@mui/material';
import Typography from '@mui/material/Typography';

export function ImageAnalysis(): JSX.Element {

    return (
        <Box pt={2}>
            <Paper elevation={1}>
                <Card sx={{ padding: 1 }}>
                    <Typography>IMAGE ANALYSIS</Typography>
                </Card>
            </Paper>
        </Box>
    );
}
