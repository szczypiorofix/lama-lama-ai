import { Box, Container, LinearProgress } from '@mui/material';

export interface ProgressBarProps {
    progress: number;
}

export function ProgressBar(props: ProgressBarProps) {
    return  <Container maxWidth='lg'>
        <Box sx={{
            width: '100%',
            marginLeft: 'auto',
            marginRight: 'auto',
            border: '1px solid #e0e0e0',
            backgroundColor: 'white',
            minHeight: '12px',
            paddingLeft: '12px',
            paddingRight: '12px',
            paddingTop: '6px',
            paddingBottom: '12px',
            borderRadius: '2px',
            position: 'relative'
        }}>
            <LinearProgress
                variant="determinate"
                value={props.progress}
                sx={{ width: 'calc(100% - 24px)', position: 'absolute', top: '50%' }}
            />
        </Box>
    </Container>
}
