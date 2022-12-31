
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Button, Card, Container, Paper, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import { Stack } from '@mui/system';
import { Application, ICanvas } from 'pixi.js';
import dragAndDrop from '../apps/dragAndDrop'
import hw from '../apps/helloWorld'
import { useState } from 'react';
import PixiApp from './pixiApp';
import tining from '../apps/tining'
import { version } from 'os';
import click from '../apps/click';
import keyEvents from '../apps/keyEvents';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function Layout() {
    const [actualApp, setActualApp] = useState(hw)
    const przyklady: { nazwa: string, app: () => Promise<Application<ICanvas>> }[] = [
        { nazwa: 'hello World', app: hw },
        { nazwa: 'Tining', app: tining },
        { nazwa: 'Click', app: click },
        { nazwa: 'DragAndDrop', app: dragAndDrop },
        { nazwa: 'KeyEvent', app: keyEvents },
    ]

    return (
        <Container sx={{ border: '1px dashed red' }}>
            <Box sx={{
                width: 200,
                border: '1px'
            }}>
            </Box>
            <Grid2 container>
                <Grid2 sx={{
                    border: '1px ',
                    width: 0.7,
                    maxWidth: '20em'
                }} >
                    <Stack>
                        {przyklady.map((przyklad) => {
                            return <Button
                                sx={{ margin: '3px' }}
                                variant='contained'
                                onClick={() => { setActualApp(przyklad.app) }}>{przyklad.nazwa}

                            </Button>;
                        })}
                        {/* {[<Button>b1</Button>, <Button>b2</Button>]} */}
                    </Stack>

                </Grid2>
                <Grid2 width={0.3}>
                    <PixiApp app={() => actualApp} />
                </Grid2>
            </Grid2>

        </Container>
    );
}