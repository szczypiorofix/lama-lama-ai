import { JSX } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import {
    Box,
    Card, Divider, List, ListItem, ListItemIcon, ListItemText,
    Paper,
} from '@mui/material';
import Typography from '@mui/material/Typography';

export function Home(): JSX.Element {

    return (
        <Box pt={2}>
            <Paper elevation={1}>
                <Card sx={{ padding: 1 }}>
                    <Typography
                        variant={'body1'}
                        component={'h2'}
                        m={2}
                    >
                        This application can use a local AI for many things like:
                    </Typography>
                    <List dense={false} sx={{ mb: 1}}>
                        <ListItem>
                            <ListItemIcon>
                                <CheckIcon />
                            </ListItemIcon>
                            <ListItemText primary="Chat" />
                        </ListItem>
                        <Divider component="li" />
                        <ListItem>
                            <ListItemIcon>
                                <CheckIcon />
                            </ListItemIcon>
                            <ListItemText primary="Image analysis" />
                        </ListItem>
                        <Divider component="li" />
                        <ListItem>
                            <ListItemIcon>
                                <CheckIcon />
                            </ListItemIcon>
                            <ListItemText primary="Train local AI with your own data" />
                        </ListItem>
                        <Divider component="li" />
                    </List>
                </Card>
            </Paper>
        </Box>
    );
}
