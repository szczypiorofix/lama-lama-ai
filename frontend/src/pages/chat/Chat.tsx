import { JSX, useEffect, useState } from 'react';

import {
    Box,
    Button,
    ButtonGroup,
    Card,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import CardContent from '@mui/material/CardContent';

import { DropdownList } from '../../components/dropdown-list/DropdownList.tsx';
import { Loader } from '../../components/loader/Loader.tsx';
import { useGlobalAppContext } from '../../context/AppContext.tsx';
import { useFetchModels } from '../../hooks/useFetchModels.ts';
import { API_BASE_URL } from '../../shared/constants';
import { LlmModelPurpose } from '../../shared/enums';
import { LlmImage, RagAskResponse } from '../../shared/models';

export function Chat(): JSX.Element {
    const [inputValue, setInputValue] = useState('');
    const [strictAnswer, setStrictAnswer] = useState<boolean>(false);
    const [useContextOnly, setUseContextOnly] = useState<boolean>(false);
    const [lastQuestion, setLastQuestion] = useState('');
    const [loadingAnswerResponse, setLoadingAnswerResponse] = useState(false);
    const [response, setResponse] = useState('');
    const [selectedModel, setSelectedModel] = useState<string | null>(null);

    const [streamOutput, setStreamOutput] = useState<boolean>(false);
    const [streaming, setStreaming] = useState(false);

    const { error, updated, loading } = useFetchModels();
    const { state } = useGlobalAppContext();

    const sendStreamRequest = async () => {
        setResponse('');
        setStreaming(true);
        setLoadingAnswerResponse(false);

        const encodedPrompt: string = encodeURIComponent(inputValue);
        const eventUrl: string =
            `${API_BASE_URL}/chat/message?` +
            `question=${encodedPrompt}` +
            `&selectedModel=${selectedModel}` +
            `&strictAnswer=${strictAnswer}` +
            `&useContextOnly=${useContextOnly}`;

        const eventSource = new EventSource(eventUrl);

        eventSource.onmessage = (event) => {
            setResponse((prev) => prev + event.data);
        };

        eventSource.onerror = (err) => {
            console.error('Connection error!', err);
            setStreaming(false);
            setInputValue('');
            eventSource.close();
        };

        eventSource.onopen = () => {
            console.log('SSE connection opened');
        };

        eventSource.addEventListener('end', () => {
            console.log('SSE connection closed');
            setInputValue('');
            setStreaming(false);
        });
    };

    const sendStandardRequest = async () => {
        const requestUrl: string = API_BASE_URL + '/chat/message';
        try {
            const resp = await fetch(requestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: inputValue,
                    selectedModel: selectedModel,
                    strictAnswer: strictAnswer,
                    useContextOnly: useContextOnly,
                }),
            });

            const response = (await resp.json()) as RagAskResponse;
            console.log('Response: ', response);
            if (response.answer) {
                setResponse(response.answer);
            }
        } catch (err) {
            console.error(err);
            setResponse('Connection error: ' + JSON.stringify(err));
        } finally {
            setLoadingAnswerResponse(false);
            setInputValue('');
        }
    };

    const sendQuestion = async () => {
        setLastQuestion(inputValue);
        setLoadingAnswerResponse(true);

        if (streamOutput) {
            await sendStreamRequest();
        } else {
            await sendStandardRequest();
        }
    };

    const getSelectedModelName = (llmImage: LlmImage) => {
        if (!llmImage?.name || !llmImage?.version) {
            return '';
        }
        return llmImage.name + ':' + llmImage.version;
    };

    useEffect(() => {
        if (state.llms.length > 0) {
            setSelectedModel(getSelectedModelName(state.llms[0]));
        }
    }, [state.llms]);

    return (
        <Box pt={2}>
            <Paper elevation={1}>
                {loading ? (
                    <Loader />
                ) : (
                    <Card sx={{ padding: 1 }}>
                        {updated ? (
                            <CardContent>
                                <DropdownList
                                    values={state.llms.filter(
                                        (model) =>
                                            model.downloaded &&
                                            model.purpose ==
                                                LlmModelPurpose.CHAT
                                    )}
                                    getLabel={(item) =>
                                        getSelectedModelName(item)
                                    }
                                    onSelect={(item) =>
                                        setSelectedModel(getSelectedModelName(item))
                                    }
                                    label={'Select LLM'}
                                />
                                <Box
                                    component={'form'}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'flex-start',
                                        alignItems: 'flex-start',
                                        width: '100%',
                                    }}
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        console.log(inputValue);

                                        if (!selectedModel) {
                                            setResponse('Select a model first');
                                            return;
                                        }
                                        (async () => {
                                            await sendQuestion();
                                        })();
                                    }}
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                value={strictAnswer}
                                                onChange={(e) =>
                                                    setStrictAnswer(
                                                        e.currentTarget.checked
                                                    )
                                                }
                                            />
                                        }
                                        label='Strict answer (distance threshold < 0.6, default: 1.0)'
                                        disabled={
                                            loadingAnswerResponse || streaming
                                        }
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                value={useContextOnly}
                                                onChange={(e) =>
                                                    setUseContextOnly(
                                                        e.currentTarget.checked
                                                    )
                                                }
                                            />
                                        }
                                        label='Use trained context only'
                                        disabled={
                                            loadingAnswerResponse || streaming
                                        }
                                    />
                                    <FormControlLabel
                                        sx={{ mb: 1 }}
                                        control={
                                            <Checkbox
                                                value={streamOutput}
                                                onChange={(e) =>
                                                    setStreamOutput(
                                                        e.currentTarget.checked
                                                    )
                                                }
                                            />
                                        }
                                        label='Stream output'
                                        disabled={
                                            loadingAnswerResponse || streaming
                                        }
                                    />
                                    <ButtonGroup
                                        variant='contained'
                                        aria-label='Basic button group'
                                        sx={{
                                            width: '100%',
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <TextField
                                            id='outlined-basic'
                                            label='Write a question'
                                            variant='outlined'
                                            value={inputValue}
                                            onChange={(e) =>
                                                setInputValue(e.target.value)
                                            }
                                            fullWidth={true}
                                            disabled={
                                                loadingAnswerResponse ||
                                                streaming
                                            }
                                            required={true}
                                        />
                                        <Button
                                            variant='contained'
                                            type='submit'
                                            disabled={
                                                loadingAnswerResponse ||
                                                streaming
                                            }
                                        >
                                            Send
                                        </Button>
                                    </ButtonGroup>
                                </Box>
                                {(loadingAnswerResponse ||
                                    (response.length === 0 && streaming)) && (
                                    <Box
                                        mt={8}
                                        mb={4}
                                        sx={{
                                            width: '100%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <CircularProgress />
                                    </Box>
                                )}
                                {response !== '' && !loadingAnswerResponse && (
                                    <Box mt={4}>
                                        <Box mt={1} mb={2}>
                                            <Typography
                                                variant={'body1'}
                                                component={'div'}
                                            >
                                                <b>Question</b>:
                                                <div>{lastQuestion}</div>
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography
                                                variant={'body1'}
                                                component={'div'}
                                            >
                                                <b>Answer</b>:
                                                <div>{response}</div>
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                            </CardContent>
                        ) : (
                            <Loader />
                        )}
                    </Card>
                )}
                {error && (
                    <Box>
                        <Typography variant={'body1'} component={'p'}>
                            {error}
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Box>
    );
}
