import { Fragment, useEffect, useState } from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Button, Divider, List, ListItem, ListItemText } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { ProgressBar } from '../../components/progress-bar/ProgressBar.tsx';
import { setBackgroundTask } from '../../context/AppActions.ts';
import { useGlobalAppContext } from '../../context/AppContext.tsx';
import { useFetchModels } from '../../hooks/useFetchModels.ts';
import { API_BASE_URL } from '../../shared/constants';
import { BackgroundTaskStatusEnum, LlmModelImageStatus } from '../../shared/enums';
import { llmModelPurposeParser } from '../../shared/helpers/LlmModelPurposeParser.ts';
import { BackgroundTask, LlmImage } from '../../shared/models';

interface PullingImageModel {
    status: string;
    digest?: string;
    total?: number;
    completed?: number;
}

export function LlmModels() {
    const [pullImage, setPullImage] = useState<string | null>(null);
    const [deleteImage, setDeleteImage] = useState<string | null>(null);

    const { error, updated, refresh, loading } = useFetchModels();
    const { state, dispatch } = useGlobalAppContext();

    useEffect(() => {
        if (pullImage) {
            const startModelDownload = (modelName: string) => {
                const imageNameParts: string[] = modelName.split(':');
                const foundLlmImage: LlmImage | null =
                    state.llms.find(
                        (llm) =>
                            llm.name === imageNameParts[0] &&
                            llm.version === imageNameParts[1]
                    ) || null;

                if (foundLlmImage) {
                    const backgroundTask: BackgroundTask<LlmImage> = {
                        id: 1,
                        name: 'Downloading LLM model',
                        message: `Downloading ${modelName} ...`,
                        progress: 0,
                        taskObject: foundLlmImage,
                        status: BackgroundTaskStatusEnum.RUNNING,
                        error: null,
                    };
                    setBackgroundTask(dispatch, backgroundTask);
                }
            };

            startModelDownload(pullImage);
        }
    }, [dispatch, pullImage, refresh, state.llms]);

    useEffect(() => {
        if (deleteImage) {
            const url: string = `${API_BASE_URL}/models/delete`;
            fetch(url, {
                method: 'DELETE',
                body: JSON.stringify({
                    name: deleteImage
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((response) => {
                return response.json();
            })
                .then((resp) => {
                    console.log(resp);
                })
                .catch((err) => {
                    console.error(err);
                })
                .finally(() => {
                    setDeleteImage(null);
                    refresh();
                })
        }
    }, [deleteImage, refresh]);

    useEffect(() => {
        function startDownloadTask(name: string) {
            console.log('Starting download task for ', name);
            const eventSource = new EventSource(
                `${API_BASE_URL}/models/pull/${name}/stream`
            );

            eventSource.onmessage = (event: MessageEvent<string>) => {
                const backgroundTask = state.backgroundTask;
                if (!backgroundTask) {
                    return;
                }
                if (event.data.startsWith('{')) {
                    const data = JSON.parse(event.data) as PullingImageModel;
                    const completed = data.completed || 0;
                    const total = data.total || 0;
                    if (total <= 0) {
                        return;
                    }

                    backgroundTask.progress = Math.round(
                        (completed * 100) / total
                    );
                } else {
                    backgroundTask.message = event.data;
                    backgroundTask.status = BackgroundTaskStatusEnum.FINISHED;
                }
                setBackgroundTask(dispatch, backgroundTask);
            };

            eventSource.addEventListener('end', () => {
                console.log('Model pull complete');
                const backgroundTask = state.backgroundTask;
                if (backgroundTask) {
                    backgroundTask.taskObject = null;
                    backgroundTask.status = BackgroundTaskStatusEnum.FINISHED;
                    backgroundTask.progress = 0;
                    setBackgroundTask(dispatch, backgroundTask);
                }
                eventSource.close();
                setPullImage(null);
                refresh();
            });

            eventSource.onerror = (e) => {
                console.error('Error during pull', e);
                eventSource.close();
                const backgroundTask = state.backgroundTask;
                if (backgroundTask) {
                    backgroundTask.taskObject = null;
                    backgroundTask.status = BackgroundTaskStatusEnum.FINISHED;
                    backgroundTask.progress = 0;
                    setBackgroundTask(dispatch, backgroundTask);
                }
                setPullImage(null);
                refresh();
            };
        }

        if (state.backgroundTask?.status === BackgroundTaskStatusEnum.RUNNING) {
            const image: LlmImage = state.backgroundTask
                ?.taskObject as LlmImage;
            const imageName: string = image.name + ':' + image.version;
            startDownloadTask(imageName);
        }
    }, [dispatch, refresh, state.backgroundTask, state.backgroundTask?.status]);

    const ModelListItem = (props: {
        image: LlmImage;
        isLast: boolean;
        downloading: boolean;
        progress: number;
    }) => {
        const imageFullName: string =
            props.image.name + ':' + props.image.version;
        const isDownloading: boolean = !updated ||
            loading ||
            pullImage !== null ||
            props.image.status == LlmModelImageStatus.DOWNLOADING ||
            props.image.status == LlmModelImageStatus.DOWNLOADED;
        return (
            <Fragment>
                <ListItem sx={{ pt: 0, pb: 0, pl: 1, pr: 1 }}>
                    <Box sx={{ minWidth: '64px' }}>
                        {!props.image.downloaded ? (
                            <IconButton
                                onClick={() => setPullImage(imageFullName)}
                                disabled={isDownloading}
                                loading={props.downloading}
                            >
                                <DownloadIcon color='primary' fontSize={'small'} />
                            </IconButton>
                        ) : (
                            <IconButton
                                disabled={pullImage !== null}
                                onClick={() => setDeleteImage(imageFullName)}
                            >
                                <DeleteIcon color='primary' fontSize={'small'} />
                            </IconButton>
                        )}
                    </Box>
                    <ListItemText
                        primary={imageFullName}
                        secondary={llmModelPurposeParser(props.image.purpose)}
                        sx={{ minWidth: '132px' }}
                    />
                    {props.downloading && (
                        <ProgressBar progress={props.progress} />
                    )}
                </ListItem>
                {!props.isLast && <Divider />}
            </Fragment>
        );
    };

    return <Box>
        <Typography mb={2}>
            List of available local LLM models
        </Typography>
        <Box mb={1} mt={1}>
            <Button
                variant='contained'
                onClick={() => refresh()}
                disabled={
                    !updated ||
                    loading ||
                    pullImage !== null ||
                    state.backgroundTask?.status === BackgroundTaskStatusEnum.RUNNING
                }
                loading={
                    !updated || loading || pullImage !== null
                }
                startIcon={<RefreshIcon />}
            >
                Refresh list
            </Button>
        </Box>
        {!loading && (
            <List dense={false} sx={{ mb: 1 }}>
                {state.llms.map((modelItem, index) => (
                    <ModelListItem
                        key={index}
                        image={modelItem}
                        isLast={index === state.llms.length - 1}
                        progress={
                            state.backgroundTask?.progress || 0
                        }
                        downloading={
                            modelItem.id ===
                            (state.backgroundTask?.taskObject as LlmImage)?.id &&
                            (state.backgroundTask?.status ===
                                BackgroundTaskStatusEnum.RUNNING ||
                                state.backgroundTask?.status ===
                                BackgroundTaskStatusEnum.SUSPENDED)
                        }
                    />
                ))}
            </List>
        )}
        {error && error.length > 0 && (
            <Box mb={2} mt={2}>
                <Typography variant={'body1'}>
                    An error occurred: {error}
                </Typography>
            </Box>
        )}
    </Box>
}
