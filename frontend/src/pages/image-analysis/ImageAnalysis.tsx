import { ChangeEvent, JSX, MouseEvent, useRef, useState } from 'react';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import {
    Box, Button,
    Card,
    Paper, styled,
} from '@mui/material';
import Typography from '@mui/material/Typography';

import { API_BASE_URL } from '../../shared/constants';

interface UploadState {
    uploading: boolean;
    file: File | null;
    response: string;
    responseCode: number;
    previewUrl: string;
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

export function ImageAnalysis(): JSX.Element {
    const [state, setState] = useState<UploadState>({
        uploading: false,
        file: null,
        response: '',
        responseCode: 0,
        previewUrl: ''
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile: File | null = event.target.files ? event.target.files[0] : null;
        if (selectedFile) {
            const objectUrl = URL.createObjectURL(selectedFile);
            setState({
                uploading: false,
                file: selectedFile,
                response: '',
                responseCode: 100,
                previewUrl: objectUrl
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
            console.log('Sending file: ', state.file.name);
            let responseString: string = '';
            let responseCode: number = 0;

            const formData = new FormData();
            formData.append('file', state.file);

            const requestUrl: string = API_BASE_URL+ '/image/analyze';
            try {
                const resp = await fetch(
                    requestUrl,
                    {
                        method: 'POST',
                        body: formData,
                    }
                );

                const responseJson = (await resp.json());
                console.log('Response: ', responseJson);
                responseString = responseJson.message;
                responseCode = responseJson.code;
            } catch (err: any) {
                console.error(err);
                responseCode = 500;
                responseString = "An error occurred: " + err.toString();
            } finally {
                setState({
                    ...state,
                    uploading: false,
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
        <Box pt={2}>
            <Paper elevation={1}>
                <Card sx={{ padding: 1 }}>
                    <Typography mb={2} variant={'h5'}>Image analysis</Typography>
                    <Box mt={1} ml={1} mr={1} mb={4}>
                        <Typography mb={1} variant={'body1'}>Upload image file AI analysis</Typography>
                        <Button
                            component='label'
                            role={undefined}
                            variant='contained'
                            tabIndex={-1}
                            disabled={state.uploading}
                            startIcon={<CloudUploadIcon />}
                        >
                            Upload image
                            <VisuallyHiddenInput
                                type='file'
                                onClick={handleFileInputClick}
                                onChange={handleFileChange}
                                ref={fileInputRef}
                                accept={'.jpg'}
                                multiple={false}
                            />
                        </Button>
                        {state.file && state.previewUrl && (
                            <Box mt={1} mb={1}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1, mb: 1 }}>
                                    <img src={state.previewUrl} alt="preview" style={{ maxWidth: '240px', width: '100%', height: 'auto' }} />
                                </Box>
                                <Typography
                                    variant={'body1'}
                                    sx={{ color: 'darkcyan', mb: 2, textAlign: 'center' }}
                                >
                                    {state.file.name}
                                </Typography>
                                <Box m={2}>
                                    <Typography align={'center'}>Describe what is in this image?</Typography>
                                </Box>
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
                                        Analyse
                                    </Button>
                                </Box>
                            </Box>
                        )}
                        {state.responseCode > 0 && (
                            <Box m={2}>
                                <Typography variant={'body1'}>{state.response}</Typography>
                            </Box>
                        )}
                    </Box>
                </Card>
            </Paper>
        </Box>
    );
}
