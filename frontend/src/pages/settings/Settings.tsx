import {Fragment, JSX, useEffect, useState} from 'react';

import CheckCircleIcon from '@mui/icons-material/CheckCircleOutline';
import DownloadIcon from '@mui/icons-material/Download';
import {Box, Button, Card, Divider, List, ListItem, ListItemIcon, ListItemText, Paper,} from '@mui/material';
import Typography from '@mui/material/Typography';

import {Loader} from '../../components/loader/Loader.tsx';
import {useGlobalAppContext} from '../../context/AppContext.tsx';
import {useFetchModels} from '../../hooks/useFetchModels.ts';
import {llmModelPurposeParser} from "../../shared/helpers/LlmModelPurposeParser.ts";
import {BackgroundTask, LlmImage} from '../../shared/models';
import {addBackgroundTask} from "../../context/AppActions.ts";
import {BackgroundTaskStatusEnum} from "../../shared/enums";

export function Settings(): JSX.Element {
    const [pullError, setPullError] = useState('');
    const [pullImage, setPullImage] = useState<string | null>(null);

    const { error, updated, refresh, loading } = useFetchModels();
    const { state, dispatch } = useGlobalAppContext();

    useEffect(() => {
        if (pullImage) {
            // const pullImageRequest = async () => {
            //     try {
            //         await fetch(API_BASE_URL + '/models/pull', {
            //                 method: 'POST',
            //                 headers: {
            //                     'Content-Type': 'application/json',
            //                 },
            //                 body: JSON.stringify({name: pullImage})
            //             })
            //             .then((response) => response.json())
            //             .then((response: LlmImageDownloadResponse) => {
            //                 console.log('Response: ', response);
            //                 if (!response.success) {
            //                     setPullError(response.message);
            //                 }
            //             })
            //             .catch(error => {
            //                 console.error(error);
            //                 setPullError(error.toString());
            //             })
            //             .finally(() => {
            //                 setPullImage(null);
            //                 refresh();
            //             })
            //     } catch (err) {
            //         console.error(err);
            //         setPullError(JSON.stringify(err));
            //     }
            // };
            // pullImageRequest().then().catch(err => console.error(err));

            const startModelDownload = (modelName: string) => {
                // const source = new EventSource(`${API_BASE_URL}/models/pull/${modelName}/stream`);
                //
                // source.onmessage = (event) => {
                //     const data = JSON.parse(event.data);
                //     console.log('progress:', data);
                // };
                //
                // source.addEventListener('end', () => {
                //     console.log('Model pull complete');
                //     source.close();
                // });
                //
                // source.onerror = (e) => {
                //     console.error('Error during pull', e);
                //     source.close();
                // };

                const backgroundTask: BackgroundTask = {
                    name: 'Downloading model',
                    message: 'Downloading LLM model',
                    progress: 0,
                    status: BackgroundTaskStatusEnum.IDLE,
                    error: null,
                }
                addBackgroundTask(dispatch, backgroundTask);

            };

            startModelDownload(pullImage);
        }
    }, [dispatch, pullImage, refresh]);

    const ModelListItem = (props: { image: LlmImage, index: number, isLast: boolean }) => {
        return <Fragment key={props.index}>
            <ListItem>
                {!props.image.downloaded ?
                    <ListItemIcon>
                        <DownloadIcon color="primary" fontSize={"medium"} sx={{cursor: 'pointer'}} onClick={() => {
                            setPullImage(props.image.name + ':' + props.image.version);
                        }}/>
                    </ListItemIcon>
                    :
                    <ListItemIcon>
                        <CheckCircleIcon color="primary" fontSize={"medium"} />
                    </ListItemIcon>
                }
                <ListItemText primary={ props.image.name + ':' + props.image.version} secondary={llmModelPurposeParser(props.image.purpose)}/>
            </ListItem>
            {!props.isLast && <Divider />}
        </Fragment>
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
                                {state.llms.map((modelItem, index) => <ModelListItem
                                    image={modelItem}
                                    index={index}
                                    isLast={index === state.llms.length - 1}
                                />)}
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
