import { JSX } from 'react';

import { Box, Typography } from '@mui/material';

import localLlamaImage from '../../assets/images/local_llama.jpg';

export function Logo(): JSX.Element {
    return (
        <Box>
            <Box className='image-container'>
                <img
                    src={localLlamaImage}
                    alt={'Local llama logo'}
                    loading='lazy'
                />
            </Box>
            <Typography
                mb={3}
                variant='h5'
                component='div'
                textAlign={'center'}
            >
                Ask your local Lama Lama AI anything
            </Typography>
        </Box>
    );
}
