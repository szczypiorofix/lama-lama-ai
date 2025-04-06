import { JSX, PropsWithChildren } from 'react';

import { Box } from "@mui/material";

type FooterProps = PropsWithChildren;

export function Footer(props: FooterProps): JSX.Element {
    return <Box component={'footer'} pt={2} pb={2} textAlign={"center"} sx={{ fontSize: 12}}>
        {props.children}
    </Box>;
}
