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

export interface UploadProps {
    title: string;
    buttonText: string;
    acceptType: string;
    urlPath: string;
    multiple: boolean;
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
        files: null,
        response: '',
        responseCode: 0,
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files ?? []).filter(
            (file) => file //file.type === 'text/plain'
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
            if (props.multiple) {
                for (const file of state.files) {
                    formData.append('files', file);
                }
            } else {
                formData.append('files', state.files[0]);
            }


            let responseString: string = '';
            let responseCode: number = state.responseCode;

            console.log(formData);

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
                    multiple={props.multiple}
                />
            </Button>
            {state.responseCode > 0 && (
                <Box mt={2} mb={2}>
                    <Typography variant={'body1'}>{state.response}</Typography>
                </Box>
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
