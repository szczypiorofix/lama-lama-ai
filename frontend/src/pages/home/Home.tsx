import { JSX, useEffect, useState } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import {
    Box, Button,
    Card, Divider, List, ListItem, ListItemIcon, ListItemText,
    Paper, TextField,
} from '@mui/material';
import Typography from '@mui/material/Typography';

import { API_BASE_URL } from '../../shared/constants';

export function Home(): JSX.Element {
    const [textToRead, setTextToRead] = useState('');
    const [response, setResponse] = useState('');
    const [sent, setSent] = useState(false);
    
    useEffect(() => {
        const playPiper = async () => {
            const requestUrl: string = API_BASE_URL+ '/tts';
            const response = await fetch(requestUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: textToRead
                })
            });

            if (!response.ok) {
                const errorResponse: string = await response.text();
                console.error("Audio error:", errorResponse);
                setResponse(errorResponse);
                setSent(false);
                return;
            }

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play()
                .then(() => console.log('Playing audio...'))
                .catch(err => {
                    console.error(err);
                    setResponse(err.toString());
                    setSent(false);
                });

            audio.onended = () => {
                console.log('Stopped playing audio.');
                setSent(false);
            };
        };
        if (sent) {
            playPiper()
                .then()
                .catch(err => console.error(err))
                .finally(() => setSent(false));
        }
    }, [sent, textToRead]);

    return (
        <Box pt={2}>
            <Paper elevation={1}>
                <Card sx={{ padding: 1 }}>
                    <Typography
                        variant={'body1'}
                        component={'h2'}
                        m={2}
                    >
                        This application can use a local AI for many things like:
                    </Typography>
                    <List dense={false} sx={{ mb: 1}}>
                        <ListItem>
                            <ListItemIcon>
                                <CheckIcon />
                            </ListItemIcon>
                            <ListItemText primary="Chat" />
                        </ListItem>
                        <Divider component="li" />
                        <ListItem>
                            <ListItemIcon>
                                <CheckIcon />
                            </ListItemIcon>
                            <ListItemText primary="Image analysis" />
                        </ListItem>
                        <Divider component="li" />
                        <ListItem>
                            <ListItemIcon>
                                <CheckIcon />
                            </ListItemIcon>
                            <ListItemText primary="Train local AI with your own data" />
                        </ListItem>
                        <Divider component="li" />
                    </List>
                </Card>
            </Paper>
            <Box mt={1} mb={1}>
                <Typography mt={2} mb={2} variant={'body1'}>Enter text to read:</Typography>
                <TextField
                    id="outlined-basic"
                    label="Outlined"
                    variant="outlined"
                    sx={{ minWidth: '400px', mb: 2, mt: 1}}
                    size={'small'}
                    value={textToRead}
                    onChange={(e) => setTextToRead(e.target.value)}
                    fullWidth={true}
                />
                <Button variant="contained" onClick={() => {
                    setSent(true);
                }}>Read me!</Button>
            </Box>
            { response.length > 0 && (
                <Box mt={2} mb={2}>
                    <Typography variant={'body1'}>{response}</Typography>
                </Box>
            )}
        </Box>
    );
}
