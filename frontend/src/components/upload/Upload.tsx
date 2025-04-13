import { ChangeEvent, JSX, useRef, useState } from 'react';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import { Box, Button, styled, Typography } from '@mui/material';

interface UploadState {
    uploading: boolean;
    file: File | null;
    response: string;
    responseCode: number;
}

interface UploadResponse {
    message: string;
    fileName: string;
    code: number;
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export function Upload(): JSX.Element {
    const [state, setState] = useState<UploadState>({
        uploading: false,
        file: null,
        response: '',
        responseCode: 0,
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setState({
                uploading: false,
                file: file,
                response: '',
                responseCode: 100,
            });
        }
    };

    const handleFileInputClick = (
        event: React.MouseEvent<HTMLInputElement>
    ) => {
        event.currentTarget.value = '';
        setState({
            ...state,
            response: '',
            responseCode: 0,
        });
    };

    const sendFileToServer = async () => {
        if (state.file) {
            const formData = new FormData();
            formData.append('file', state.file);

            let responseString: string = '';
            let responseCode: number = state.responseCode;

            console.log(formData);

            try {
                const resp = await fetch(
                    'http://localhost:3000/v1/api/sendfile',
                    {
                        method: 'POST',
                        body: formData,
                    }
                );

                const responseJson = (await resp.json()) as UploadResponse;
                console.log('Response: ', responseJson);
                responseString = responseJson.message;
                responseCode = responseJson.code;
            } catch (err) {
                console.error(err);
                responseCode = 500;
                responseString = JSON.stringify(err);
            } finally {
                console.log('Clear all');
                setState({
                    uploading: false,
                    file: null,
                    response: responseString,
                    responseCode: responseCode,
                });
            }
        }
    };

    const uploadFile = () => {
        if (fileInputRef.current) {
            setState({
                ...state,
                uploading: true,
            });

            fileInputRef.current.value = '';
            (async () => {
                await sendFileToServer();
            })();
        }
    };

    return (
        <Box m={1}>
            <Button
                component='label'
                role={undefined}
                variant='contained'
                tabIndex={-1}
                disabled={state.uploading}
                startIcon={<CloudUploadIcon />}
            >
                Upload file
                <VisuallyHiddenInput
                    type='file'
                    onClick={handleFileInputClick}
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    accept={'.txt'}
                />
            </Button>
            {state.responseCode > 0 && (
                <Typography variant={'body1'}>{state.response}</Typography>
            )}
            {state.file !== null && (
                <Box mt={1} mb={1}>
                    <Typography variant={'body1'} sx={{ color: 'darkcyan' }}>
                        Uploaded file: {state.file.name}
                    </Typography>
                    <Box
                        display={'flex'}
                        flex={1}
                        flexGrow={1}
                        flexDirection={'row'}
                        justifyContent={'center'}
                    >
                        <Button
                            loading={state.uploading}
                            variant='contained'
                            endIcon={<SendIcon />}
                            onClick={uploadFile}
                            loadingPosition='end'
                        >
                            Send
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
}
