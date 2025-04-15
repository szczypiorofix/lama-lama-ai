import { JSX, useState } from 'react';

import {
    Box,
    Button,
    ButtonGroup,
    Card, Checkbox,
    CircularProgress,
    Divider, FormControlLabel,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import CardContent from '@mui/material/CardContent';

import { Logo } from '../../components/logo/Logo.tsx';
import { Upload } from '../../components/upload/Upload.tsx';
import { RagAskResponse } from '../../shared/models';

export function Home(): JSX.Element {
    const [inputValue, setInputValue] = useState('');
    const [strictAnswer, setStrictAnswer] = useState<boolean>(false);
    const [useContextOnly, setUseContextOnly] = useState<boolean>(false);
    const [lastQuestion, setLastQuestion] = useState('');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState('');

    const sendQuestion = async () => {
        setLastQuestion(inputValue);
        setLoading(true);
        try {
            const resp = await fetch('http://localhost:3000/v1/api/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: inputValue,
                    strictanswer: strictAnswer,
                    usecontextonly: useContextOnly,
                }),
            });

            const response = (await resp.json()) as RagAskResponse;
            console.log('Response: ', response);
            if (response.answer) {
                setResponse(response.answer);
            }
            setInputValue('');
        } catch (err) {
            console.error(err);
            setResponse('Connection error: ' + JSON.stringify(err));
            setInputValue('');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box pt={2}>
            <Paper elevation={1}>
                <Card sx={{ padding: 1 }}>
                    <CardContent>
                        <Logo />
                        <Divider sx={{ mb: 4 }} />
                        <Upload />
                        <Divider sx={{ mb: 4 }} />
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
                                (async () => {
                                    await sendQuestion();
                                })();
                            }}
                        >
                            <FormControlLabel
                                control={<Checkbox value={strictAnswer} onChange={(e) => setStrictAnswer(e.currentTarget.checked)} />}
                                label="Strict answer (distance threshold < 0.6, default: 1.0)"
                            />
                            <FormControlLabel
                                sx={{ mb: 1 }}
                                control={<Checkbox value={useContextOnly} onChange={(e) => setUseContextOnly(e.currentTarget.checked)} />}
                                label="Use trained context only"
                            />
                            <ButtonGroup
                                variant='contained'
                                aria-label='Basic button group'
                                sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
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
                                    disabled={loading}
                                    required={true}
                                />
                                <Button
                                    variant='contained'
                                    type='submit'
                                    disabled={loading}
                                >
                                    Send
                                </Button>
                            </ButtonGroup>
                        </Box>
                        {loading && (
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
                        {response !== '' && !loading && (
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
                                        <b>Answer</b>:<div>{response}</div>
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Paper>
        </Box>
    );
}
