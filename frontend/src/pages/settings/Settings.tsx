import { JSX, useEffect,useState } from 'react';

import AssistantIcon from '@mui/icons-material/Assistant';
import {
    Box, Button,
    Card, CircularProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
} from '@mui/material';
import Typography from '@mui/material/Typography';

import { useGlobalAppContext } from '../../context/AppContext.tsx';
import { API_BASE_URL } from '../../shared/constants';
import { LlmImage, LlmImageList } from '../../shared/models';

interface SettingsState {
    error: string;
    updated: boolean;
}

export function Settings(): JSX.Element {
    const [state, setState] = useState<SettingsState>({
        updated: false,
        error: '',
    });

    const { contextState, setContextState } = useGlobalAppContext();

    useEffect(() => {
        const refreshAvailableModels = () => {
            fetch(API_BASE_URL+ '/models')
                .then((response) => response.json())
                .then((response: LlmImageList) => {
                    setContextState({
                        ...contextState,
                        llms: {
                            models: response.models ?? []
                        }
                    })
                    setState({
                        ...state,
                        updated: true
                    });
                })
                .catch(error => {
                    console.error(error);
                    setState({
                        ...state,
                        error: error.toString(),
                        updated: true,
                    });
                });
        }

        if (!state.updated) {
            refreshAvailableModels();
        }
    }, [contextState, setContextState, state, state.updated]);

    const modelListItem = (image: LlmImage, index: number) => {
        return <ListItem key={index}>
            <ListItemIcon>
                <AssistantIcon />
            </ListItemIcon>
            <ListItemText primary={image.name} secondary={image.details.parameter_size}/>
        </ListItem>
    }

    return (
        <Box pt={2}>
            <Paper elevation={1}>
                <Card sx={{ padding: 1 }}>
                    <Typography variant={'h5'}>SETTINGS</Typography>
                    <Box>
                        <Typography>List of available local LLM models</Typography>
                        <Box mb={1} mt={1}>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setState({
                                        ...state,
                                        updated: false,
                                    });
                                }}
                            >Refresh list</Button>
                        </Box>
                        {state.updated
                            ?
                            <List dense={false} sx={{ mb: 1}}>
                                {contextState.llms.models.map((modelItem, index) => {
                                    return modelListItem(modelItem, index);
                                })}
                            </List>
                            :
                            <Box mt={6} mb={6} sx={{ minHeight: '120px' }}>
                                <CircularProgress />
                            </Box>
                        }
                        {state.error && (
                            <Box mb={2} mt={2}>
                                <Typography variant={'body1'}>An error occurred: {state.error}</Typography>
                            </Box>
                        )}
                    </Box>
                </Card>
            </Paper>
        </Box>
    );
}
