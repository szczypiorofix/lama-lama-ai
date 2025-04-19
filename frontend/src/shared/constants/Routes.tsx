import ChatIcon from '@mui/icons-material/Chat';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import HomeIcon from '@mui/icons-material/Home';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';

import { Chat, Home, ImageAnalysis, UploadData } from '../../pages';
import { APP_VIEW } from '../enums';
import { Route } from '../models';

export const routes: Record<APP_VIEW, Route> = {
    [APP_VIEW.HOME]: {
        name: 'Home',
        view: APP_VIEW.HOME,
        page: <Home />,
        icon: <HomeIcon />,
    },
    [APP_VIEW.CHAT]: {
        name: 'Chat',
        view: APP_VIEW.CHAT,
        page: <Chat />,
        icon: <ChatIcon />,
    },
    [APP_VIEW.UPLOAD_DATA]: {
        name: 'Upload data',
        view: APP_VIEW.UPLOAD_DATA,
        page: <UploadData />,
        icon: <DriveFolderUploadIcon />,
    },
    [APP_VIEW.IMAGE_ANALYSIS]: {
        name: 'Image analysis',
        view: APP_VIEW.IMAGE_ANALYSIS,
        page: <ImageAnalysis />,
        icon: <InsertPhotoIcon />,
    },
};
