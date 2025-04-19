import { JSX } from 'react';

import {
    Box,
    Card,
    Paper,
} from '@mui/material';
import Typography from '@mui/material/Typography';

import { Upload } from '../../components/upload/Upload.tsx';

export function UploadData(): JSX.Element {
    return (
        <Box pt={2}>
            <Paper elevation={1}>
                <Card sx={{ padding: 1 }}>
                    <Typography>UPLOAD</Typography>
                    <Upload />
                </Card>
            </Paper>
        </Box>
    );
}
