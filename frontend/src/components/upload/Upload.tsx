import { ChangeEvent, JSX, useRef, useState } from 'react';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import { Box, Button, styled, Typography } from '@mui/material';

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

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files ?? [])
            .filter(file => file.type === 'text/plain');
        setState({
            uploading: false,
            files: selectedFiles,
            response: '',
            responseCode: 100,
        });
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
        if (state.files) {
            const formData = new FormData();
            for(const file of state.files) {
                formData.append('files', file);
            }

            let responseString: string = '';
            let responseCode: number = state.responseCode;

            console.log(formData);

            try {
                const resp = await fetch(
                    'http://localhost:3000/v1/api/uploadfiles',
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
                    files: null,
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
                    multiple={true}
                />
            </Button>
            {state.responseCode > 0 && (
                <Typography variant={'body1'}>{state.response}</Typography>
            )}
            {state.files !== null && (
                <Box mt={1} mb={1}>
                    {state.files.map((file: File, index: number) => (
                        <Typography key={"file_"+index} variant={'body1'} sx={{ color: 'darkcyan' }}>
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
