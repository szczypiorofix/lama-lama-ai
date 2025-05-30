import { JSX, useRef, useState } from 'react';

import { Box, Button, Card, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';

import { API_BASE_URL } from '../../shared/constants';

export function Stt(): JSX.Element {
    const [recording, setRecording] = useState(false);
    const [transcription, setTranscription] = useState('');
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        setTranscription('');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (event: BlobEvent) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, {
                    type: 'audio/webm',
                });
                await uploadAudio(audioBlob);
                stream.getTracks().forEach((track) => track.stop());
            };

            mediaRecorder.start();
            setRecording(true);
        } catch (err) {
            console.error(err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && recording) {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    const uploadAudio = async (blob: Blob) => {
        const formData = new FormData();
        formData.append('file', blob, 'recording.webm');
        try {
            const response = await fetch(`${API_BASE_URL}/stt`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setTranscription(data.text ?? '');
        } catch (err: any) {
            console.error(err);
            setTranscription(err.toString());
        }
    };

    return (
        <Box pt={2}>
            <Paper elevation={1}>
                <Card sx={{ padding: 1 }}>
                    <Typography mb={2} variant={'h5'}>
                        Speech To Text
                    </Typography>
                    <Button
                        variant='contained'
                        onClick={recording ? stopRecording : startRecording}
                    >
                        {recording ? 'Stop recording' : 'Start recording'}
                    </Button>
                    {transcription && (
                        <Box mt={2} mb={2}>
                            <Typography variant={'body1'}>
                                {transcription}
                            </Typography>
                        </Box>
                    )}
                </Card>
            </Paper>
        </Box>
    );
}
