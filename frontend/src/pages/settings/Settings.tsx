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

import { changeLlmList } from '../../context/AppActions.ts';
import { useGlobalAppContext } from '../../context/AppContext.tsx';
import { API_BASE_URL } from '../../shared/constants';
import { LlmImage, LlmImageList } from '../../shared/models';

export function Settings(): JSX.Element {
    const [updated, setUpdated] = useState(false);
    const [error, setError] = useState('');

    const { state, dispatch } = useGlobalAppContext();

    useEffect(() => {
        const refreshAvailableModels = () => {
            fetch(API_BASE_URL+ '/models')
                .then((response) => response.json())
                .then((response: LlmImageList) => {
                    changeLlmList(dispatch, {
                        models: response.models ?? [],
                    });
                    setUpdated(true);
                })
                .catch(error => {
                    console.error(error);
                    setError(error.toString());
                    setUpdated(true);
                });
        }

        if (!updated) {
            refreshAvailableModels();
        }
    }, [dispatch, state, updated]);

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
                                onClick={() => setUpdated(false)}
                            >Refresh list</Button>
                        </Box>
                        {updated
                            ?
                            <List dense={false} sx={{ mb: 1}}>
                                {state.llms.models.map((modelItem, index) => {
                                    return modelListItem(modelItem, index);
                                })}
                            </List>
                            :
                            <Box mt={6} mb={6} sx={{ minHeight: '120px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <CircularProgress />
                            </Box>
                        }
                        {error.length > 0 && (
                            <Box mb={2} mt={2}>
                                <Typography variant={'body1'}>An error occurred: {error}</Typography>
                            </Box>
                        )}
                    </Box>
                </Card>
            </Paper>
        </Box>
    );
}
