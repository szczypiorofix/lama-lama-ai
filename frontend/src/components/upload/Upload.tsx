import { ChangeEvent, JSX, MouseEvent,useRef, useState } from 'react';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import { Box, Button, styled, TextField, Typography } from '@mui/material';

import { API_BASE_URL } from '../../shared/constants';

interface UploadState {
    uploading: boolean;
    file: File | null;
    response: string;
    responseCode: number;
    documentId: string | null;
}

export interface UploadProps {
    title: string;
    buttonText: string;
    acceptType: string;
    urlPath: string;
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

export function Upload(props: UploadProps): JSX.Element {
    const [state, setState] = useState<UploadState>({
        uploading: false,
        file: null,
        response: '',
        responseCode: 0,
        documentId: null,
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile: File | null = event.target.files ? event.target.files[0] : null;
        if (selectedFile) {
            setState({
                uploading: false,
                file: selectedFile,
                response: '',
                responseCode: 100,
                documentId: '',
            });
        }
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
        if (state.file) {
            const formData = new FormData();
            formData.append('file', state.file);
            formData.append('documentId', state.documentId || 'document');

            let responseString: string = '';
            let responseCode: number = state.responseCode;

            const requestUrl: string = API_BASE_URL+ props.urlPath;
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
            } catch (err: unknown) {
                console.error(err);
                responseCode = 500;
                responseString = "An error occurred: " + String(err);
            } finally {
                setState({
                    uploading: false,
                    file: null,
                    response: responseString,
                    responseCode: responseCode,
                    documentId: null,
                });
            }
        }
    };

    const onUploadFile = async () => {
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
            <Typography mb={1} variant={'body1'}>{props.title}</Typography>
            <Button
                component='label'
                role={undefined}
                variant='contained'
                tabIndex={-1}
                disabled={state.uploading}
                startIcon={<CloudUploadIcon />}
            >
                {props.buttonText}
                <VisuallyHiddenInput
                    type='file'
                    onClick={handleFileInputClick}
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    accept={props.acceptType}
                />
            </Button>
            {state.responseCode > 0 && (
                <Box mt={2} mb={2}>
                    <Typography variant={'body1'}>{state.response}</Typography>
                </Box>
            )}
            {state.file !== null && (
                <Box mt={1} mb={1}>
                    <Typography
                        variant={'body1'}
                        sx={{ color: 'darkcyan' }}
                    >
                        Uploaded file: {state.file.name}
                    </Typography>
                    <TextField
                        id="outlined-basic"
                        label="Data name"
                        variant="outlined"
                        size={'small'}
                        sx={{mt: 2, mb: 2}}
                        value={state.documentId}
                        onChange={(e) => setState({...state, documentId: e.target.value})}
                        fullWidth={true}
                    />
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
                            onClick={onUploadFile}
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
