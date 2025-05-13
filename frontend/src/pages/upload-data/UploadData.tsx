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
                    <Typography mb={2} variant={'h5'}>Data training</Typography>
                    <Upload
                        title={'Upload .txt file with text data for AI training'}
                        buttonText={'Upload file'}
                        acceptType={'.txt'}
                        urlPath={'/data/upload'}
                    />
                </Card>
            </Paper>
        </Box>
    );
}
