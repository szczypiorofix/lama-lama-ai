import { JSX, useEffect,useState } from 'react';

import AssistantIcon from '@mui/icons-material/Assistant';
import {
    Box,
    Card,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
} from '@mui/material';
import Typography from '@mui/material/Typography';

import { API_BASE_URL } from '../../shared/constants';
import { LlmImage, LlmImageList } from '../../shared/models';

interface SettingsState {
    modelList: LlmImageList;
    error: string;
    updated: boolean;
}

export function Settings(): JSX.Element {
    const [state, setState] = useState<SettingsState>({
        updated: false,
        error: '',
        modelList: {
            models: []
        }
    });

    useEffect(() => {
        if (!state.updated) {
            fetch(API_BASE_URL+ '/models')
                .then((response) => response.json())
                .then((response: LlmImageList) => {
                    console.log(response);
                    setState({
                        ...state,
                        modelList: response as LlmImageList,
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
    }, [state, state.updated]);

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
                        <List dense={false} sx={{ mb: 1}}>
                            {state.modelList.models.map((modelItem, index) => {
                                return modelListItem(modelItem, index);
                            })}
                        </List>
                        {state.error && (
                            <Box m={2}>
                                <Typography variant={'body1'}>An error occurred: {state.error}</Typography>
                            </Box>
                        )}
                    </Box>
                </Card>
            </Paper>
        </Box>
    );
}
