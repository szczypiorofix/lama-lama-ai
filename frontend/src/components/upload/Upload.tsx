import { ChangeEvent, JSX, MouseEvent,useRef, useState } from 'react';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import { Box, Button, styled, Typography } from '@mui/material';

import { API_BASE_URL } from '../../shared/constants';

interface UploadState {
    uploading: boolean;
    files: File[] | null;
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
        files: null,
        response: '',
        responseCode: 0,
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files ?? []).filter(
            (file) => file.type === 'text/plain'
        );
        setState({
            uploading: false,
            files: selectedFiles,
            response: '',
            responseCode: 100,
        });
    };

    const handleFileInputClick = (event: MouseEvent<HTMLInputElement>) => {
        event.currentTarget.value = '';
        setState({
            ...state,
            response: '',
            responseCode: 0,
        });
    };

    const sendFileToServer = async () => {
        if (state.files) {
            const formData = new FormData();
            for (const file of state.files) {
                formData.append('files', file);
            }

            let responseString: string = '';
            let responseCode: number = state.responseCode;

            console.log(formData);

            const requestUrl: string = API_BASE_URL+ '/data/upload';
            try {
                const resp = await fetch(
                    requestUrl,
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
                setState({
                    uploading: false,
                    files: null,
                    response: responseString,
                    responseCode: responseCode,
                });
            }
        }
    };

    const uploadFile = async () => {
        if (fileInputRef.current) {
            setState({
                ...state,
                uploading: true,
            });

            fileInputRef.current.value = '';
            await sendFileToServer();
        }
    };

    return (
        <Box mt={1} ml={1} mr={1} mb={4}>
            <Typography mb={1} variant={'body1'}>Upload .txt file(s) with text data for AI training</Typography>
            <Button
                component='label'
                role={undefined}
                variant='contained'
                tabIndex={-1}
                disabled={state.uploading}
                startIcon={<CloudUploadIcon />}
            >
                Upload file(s)
                <VisuallyHiddenInput
                    type='file'
                    onClick={handleFileInputClick}
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    accept={'.txt'}
                    multiple={true}
                />
            </Button>
            {state.responseCode > 0 && (
                <Typography variant={'body1'}>{state.response}</Typography>
            )}
            {state.files !== null && (
                <Box mt={1} mb={1}>
                    {state.files.map((file: File, index: number) => (
                        <Typography
                            key={'file_' + index}
                            variant={'body1'}
                            sx={{ color: 'darkcyan' }}
                        >
                            Uploaded file: {file.name}
                        </Typography>
                    ))}
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
