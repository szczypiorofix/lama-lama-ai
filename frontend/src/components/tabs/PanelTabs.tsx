import { JSX, ReactNode, SyntheticEvent, useState } from 'react';

import { Box, Tab, Tabs } from '@mui/material';

function tabProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

interface TabPanelProps {
    children?: ReactNode;
    index: number;
    value: number;
}

export interface PanelTabItem {
    label: string;
    content: ReactNode;
}

export interface PanelTabsProps {
    tabs: PanelTabItem[];
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

export function PanelTabs(props: PanelTabsProps): JSX.Element {
    const { tabs } = props;

    const [value, setValue] = useState(0);

    const handleChange = (_: SyntheticEvent, newValue: number) => {
        console.log(newValue);
        setValue(newValue);
    };

    return <Box>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            { tabs.map((tab, index) => {
                return (<Tab key={index} label={tab.label} {...tabProps(index)} />)
            }) }
        </Tabs>
        { tabs.map((tab, index) => {
            return <CustomTabPanel key={index} value={value} index={index}>
                {tab.content}
            </CustomTabPanel>
        })}

    </Box>
}
