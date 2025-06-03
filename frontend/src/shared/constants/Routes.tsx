import ChatIcon from '@mui/icons-material/Chat';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import HistoryIcon from '@mui/icons-material/History';
import HomeIcon from '@mui/icons-material/Home';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import SettingsIcon from '@mui/icons-material/Settings';

import { Chat, History, Home, ImageAnalysis, Settings, Stt,UploadData } from '../../pages';
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
    [APP_VIEW.HISTORY]: {
        name: 'History',
        view: APP_VIEW.HISTORY,
        page: <History />,
        icon: <HistoryIcon />,
    },
    [APP_VIEW.UPLOAD_DATA]: {
        name: 'Upload Data',
        view: APP_VIEW.UPLOAD_DATA,
        page: <UploadData />,
        icon: <DriveFolderUploadIcon />,
    },
    [APP_VIEW.IMAGE_ANALYSIS]: {
        name: 'Image Analysis',
        view: APP_VIEW.IMAGE_ANALYSIS,
        page: <ImageAnalysis />,
        icon: <InsertPhotoIcon />,
    },
    [APP_VIEW.STT]: {
        name: 'Speech To Text',
        view: APP_VIEW.STT,
        page: <Stt />,
        icon: <KeyboardVoiceIcon />,
    },
    [APP_VIEW.SETTINGS]: {
        name: 'Settings',
        view: APP_VIEW.SETTINGS,
        page: <Settings />,
        icon: <SettingsIcon />,
    },
};
