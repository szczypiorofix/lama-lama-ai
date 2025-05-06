import { Box, CircularProgress } from '@mui/material';

export interface LoaderProps {
    minHeight?: string;
    centered?: string;
    flex?: boolean;
    marginTopBottom?: number;
}

export function Loader({
   minHeight = '120px',
   centered = 'center',
   flex = true,
   marginTopBottom = 6,
}: LoaderProps) {
    return <Box
        mt={marginTopBottom}
        mb={marginTopBottom}
        sx={{
            minHeight: minHeight,
            display: flex ? 'flex' : 'block',
            justifyContent: centered,
            alignItems: centered
        }}
    >
        <CircularProgress />
    </Box>
}
