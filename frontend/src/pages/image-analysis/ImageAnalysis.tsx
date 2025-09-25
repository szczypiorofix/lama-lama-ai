import {
    ChangeEvent,
    JSX,
    MouseEvent,
    useEffect,
    useRef,
    useState,
} from 'react';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import { Box, Button, Card, Paper, styled } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import { DropdownList } from '../../components/dropdown-list/DropdownList.tsx';
import { Loader } from '../../components/loader/Loader.tsx';
import { useGlobalAppContext } from '../../context/AppContext.tsx';
import { useFetchModels } from '../../hooks/useFetchModels.ts';
import { API_BASE_URL } from '../../shared/constants';
import { LlmModelPurpose } from '../../shared/enums';
import { LlmImage } from '../../shared/models';

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
        previewUrl: '',
    });
    const [selectedModel, setSelectedModel] = useState<string | null>(null);
    const { error, updated, loading } = useFetchModels();
    const { state: globalState } = useGlobalAppContext();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFile: File | null = event.target.files
            ? event.target.files[0]
            : null;
        if (selectedFile) {
            const objectUrl = URL.createObjectURL(selectedFile);
            setState({
                uploading: false,
                file: selectedFile,
                response: '',
                responseCode: 100,
                previewUrl: objectUrl,
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
            let responseString: string = '';
            let responseCode: number = 0;

            const formData = new FormData();
            formData.append('file', state.file);

            const requestUrl: string = API_BASE_URL + '/image/analyze';
            try {
                const resp = await fetch(requestUrl, {
                    method: 'POST',
                    body: formData,
                });

                const responseJson = await resp.json();
                responseString = responseJson.message;
                responseCode = responseJson.code;
            } catch (err) {
                console.error(err);
                responseCode = 500;
                responseString = 'An error occurred: ' + JSON.stringify(err);
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
        if (fileInputRef.current && selectedModel) {
            setState({
                ...state,
                uploading: true,
            });

            fileInputRef.current.value = '';
            await sendFileToServer();
        }
    };

    useEffect(() => {
        if (globalState.llms.length > 0) {
            const foundModel: LlmImage | undefined = globalState.llms.find(
                (item) => item.purpose == LlmModelPurpose.IMAGE_ANALYSIS && item.downloaded
            );
            if (foundModel) {
                setSelectedModel(getSelectedModelName(foundModel));
            }
        }
    }, [globalState.llms]);

    const getSelectedModelName = (llmImage: LlmImage) => {
        if (!llmImage?.name || !llmImage?.version) {
            return '';
        }
        return llmImage.name + ':' + llmImage.version;
    };

    return (
        <Box pt={2}>
            {loading ? (
                <Loader />
            ) : (
                <Paper elevation={1}>
                    <Card sx={{ padding: 1 }}>
                        {!updated ? (
                            <Loader />
                        ) : (
                            <CardContent>
                                <Typography mb={2} variant={'h5'}>
                                    Image analysis
                                </Typography>
                                <Box mt={1} ml={1} mr={1} mb={4}>
                                    <DropdownList
                                        values={globalState.llms.filter(
                                            (model) =>
                                                model.downloaded &&
                                                model.purpose ==
                                                    LlmModelPurpose.IMAGE_ANALYSIS
                                        )}
                                        getLabel={(item) => {
                                            return getSelectedModelName(item);
                                        }}
                                        onSelect={(item) => {
                                            setSelectedModel(
                                                getSelectedModelName(item)
                                            );
                                        }}
                                        label={'Select LLM'}
                                    />
                                </Box>
                                <Box mt={1} ml={1} mr={1} mb={4}>
                                    <Typography mb={1} variant={'body1'}>
                                        Upload image file AI analysis
                                    </Typography>
                                    <Button
                                        component='label'
                                        role={undefined}
                                        variant='contained'
                                        tabIndex={-1}
                                        disabled={
                                            state.uploading || !selectedModel
                                        }
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
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    mt: 1,
                                                    mb: 1,
                                                }}
                                            >
                                                <img
                                                    src={state.previewUrl}
                                                    alt='preview'
                                                    style={{
                                                        maxWidth: '240px',
                                                        width: '100%',
                                                        height: 'auto',
                                                    }}
                                                />
                                            </Box>
                                            <Typography
                                                variant={'body1'}
                                                sx={{
                                                    color: 'darkcyan',
                                                    mb: 2,
                                                    textAlign: 'center',
                                                }}
                                            >
                                                {state.file.name}
                                            </Typography>
                                            <Box mt={2} mb={2}>
                                                <Typography align={'center'}>
                                                    Describe what is in this
                                                    image?
                                                </Typography>
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
                                        <Box mt={2} mb={2}>
                                            <Typography variant={'body1'}>
                                                {state.response}
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </CardContent>
                        )}
                    </Card>
                </Paper>
            )}
            {error && (
                <Box>
                    <Typography variant={'body1'} component={'p'}>
                        {error}
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
