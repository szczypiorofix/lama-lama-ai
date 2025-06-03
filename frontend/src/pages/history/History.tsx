import { JSX } from 'react';

import {
    Box,
    Button,
    Card,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';

import { useFetchChatHistory } from '../../hooks/useFetchChatHistory';
import { API_BASE_URL } from '../../shared/constants';

export function History(): JSX.Element {
    const { data, loading, error } = useFetchChatHistory();

    const deleteHistory = async () => {
        try {
            await fetch(`${API_BASE_URL}/history`, { method: 'DELETE' });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Box pt={2}>
            <Paper elevation={1}>
                <Card sx={{ padding: 1 }}>
                    <Typography mb={2} variant={'h5'}>
                        History
                    </Typography>
                    {loading && (
                        <Typography variant={'body1'}>Loading...</Typography>
                    )}
                    {error && (
                        <Typography variant={'body1'}>{error}</Typography>
                    )}
                    {data.length > 0 && (
                        <Table size={'small'}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Question</TableCell>
                                    <TableCell>Answer</TableCell>
                                    <TableCell>Model</TableCell>
                                    <TableCell>Created</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((msg) => (
                                    <TableRow key={msg.id}>
                                        <TableCell>{msg.userQuestion}</TableCell>
                                        <TableCell>{msg.modelAnswer}</TableCell>
                                        <TableCell>{msg.modelName}</TableCell>
                                        <TableCell>
                                            {new Date(msg.createdAt).toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                    {data.length === 0 && !loading && (
                        <Typography variant={'body1'}>No history</Typography>
                    )}
                    <Box mt={2}>
                        <Button variant={'contained'} color={'error'} onClick={deleteHistory}>
                            Delete All
                        </Button>
                    </Box>
                </Card>
            </Paper>
        </Box>
    );
}
