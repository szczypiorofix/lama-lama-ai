import { BackgroundTaskStatusEnum } from '../enums';

export interface BackgroundTask {
    name: string;
    progress: number;
    status: BackgroundTaskStatusEnum;
    message: string;
    error: string | null;
}
