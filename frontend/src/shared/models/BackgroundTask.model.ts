import { BackgroundTaskStatusEnum } from '../enums';

export interface BackgroundTask<T> {
    id: number;
    name: string;
    progress: number;
    status: BackgroundTaskStatusEnum;
    taskObject: T | null;
    message: string;
    error: string | null;
}
