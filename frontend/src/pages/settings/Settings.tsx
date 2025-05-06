import { JSX, useEffect,useState } from 'react';

import AssistantIcon from '@mui/icons-material/Assistant';
import DownloadIcon from '@mui/icons-material/Download';
import {
    Box, Button,
    Card,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
} from '@mui/material';
import Typography from '@mui/material/Typography';

import { Loader } from '../../components/loader/Loader.tsx';
import { useGlobalAppContext } from '../../context/AppContext.tsx';
import { useFetchModels } from '../../hooks/useFetchModels.ts';
import { API_BASE_URL } from '../../shared/constants';
import { LlmImage, LlmImageDownloadResponse } from '../../shared/models';

export function Settings(): JSX.Element {
    const [pullError, setPullError] = useState('');
    const [pullImage, setPullImage] = useState<string | null>(null);

    const { error, updated, refresh, loading } = useFetchModels();
    const { state, dispatch } = useGlobalAppContext();

    useEffect(() => {
        if (pullImage) {
            const pullImageRequest = async () => {
                try {
                    await fetch(API_BASE_URL + '/models/pull', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({name: pullImage})
                        })
                        .then((response) => response.json())
                        .then((response: LlmImageDownloadResponse) => {
                            console.log('Response: ', response);
                            if (!response.success) {
                                setPullError(response.message);
                            }
                        })
                        .catch(error => {
                            console.error(error);
                            setPullError(error.toString());
                        })
                        .finally(() => {
                            setPullImage(null);
                            refresh();
                        })
                } catch (err) {
                    console.error(err);
                    setPullError(JSON.stringify(err));
                }
            };
            pullImageRequest().then().catch(err => console.error(err));
        }
    }, [dispatch, pullImage, refresh]);

    const modelListItem = (image: LlmImage, index: number) => {
        return <ListItem key={index}>
            <ListItemIcon>
                <AssistantIcon />
            </ListItemIcon>
            <ListItemText primary={ image.name + ':' + image.version} secondary={image.downloaded ? 'Downloaded' : 'Not downloaded'}/>
            {!image.downloaded &&
                <ListItemIcon>
                    <DownloadIcon color="primary" fontSize={"medium"} sx={{cursor: 'pointer'}} onClick={() => {
                        setPullImage(image.name + ':' + image.version);
                    }}/>
                </ListItemIcon>
            }
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
                                onClick={() => refresh()}
                                disabled={!updated || loading || pullImage !== null}
                            >Refresh list</Button>
                        </Box>
                        {(pullImage && pullImage.length > 0) && <Box>
                            <Typography variant={'body1'} align={'center'}>Downloading LLM {pullImage}, please wait...</Typography>
                        </Box>}
                        {(!loading && pullImage == null)
                            ?
                            <List dense={false} sx={{ mb: 1}}>
                                {state.llms.map((modelItem, index) => {
                                    return modelListItem(modelItem, index);
                                })}
                            </List>
                            :
                            <Loader />
                        }
                        {error && error.length > 0 && (
                            <Box mb={2} mt={2}>
                                <Typography variant={'body1'}>An error occurred: {error}</Typography>
                            </Box>
                        )}
                        {pullError.length > 0 && (
                            <Box mb={2} mt={2}>
                                <Typography variant={'body1'}>An error occurred while pulling LLM image: {pullError}</Typography>
                            </Box>
                        )}
                    </Box>
                </Card>
            </Paper>
        </Box>
    );
}
