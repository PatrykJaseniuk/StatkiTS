
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Button, Card, Container, Paper, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import { Stack } from '@mui/system';
import { Application, ICanvas } from 'pixi.js';
import dragAndDrop from '../appsPixi/dragAndDrop'
import hw from '../appsPixi/helloWorld'
import { useState } from 'react';
import PixiApp from './pixiApp';
import tining from '../appsPixi/tining'
import click from '../appsPixi/click';
import keyEvents from '../appsPixi/keyEvents';
import kinematics from '../appsPixi/kinematicss';
import dynamics from '../appsPixi/dynamics';
import statekNiestabilny from '../appsPixi/statekNiestabilny';
import statekStabilny from '../appsPixi/statekStabilny';
import { WebGLRenderer } from 'three';
import ThreeAppComp from './threeApp';
import heloWorldThree from '../appsThree/helloworld';
import d2Graphics from '../appsThree/2dGraphics';
import { ThreeApp } from '../appsThree/ThreeApp';
import statek from '../appsThree/Statek';
import RuchObrotowy from '../appsThree/RuchObrotowy/RuchObrotowy';
import RuchObrotowy2 from '../appsThree/RuchObrotowy2/RuchObrotowy';
import { CanvaApp } from '../appsThree/KolejnePodejscie/app';
import { app as kolejnePodejscie } from '../appsThree/KolejnePodejscie/app';
import CanvaAppComponent from './CanvaApp';



const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


export default function Layout() {
    const [actualApp, setActualApp] = useState(<PixiApp app={hw} />) //dziwne że przesylam do useState funkcję, a actualApp jest typu, który ta funkcja zwraca
    const [showBar, setShowBar] = useState(false);
    const przykladyPixi: { nazwa: string, app: () => Promise<Application<ICanvas>> }[] = [
        { nazwa: 'hello World', app: hw },
        { nazwa: 'Tining', app: tining },
        { nazwa: 'Click', app: click },
        { nazwa: 'DragAndDrop', app: dragAndDrop },
        { nazwa: 'KeyEvent', app: keyEvents },
        { nazwa: 'Kinematics', app: kinematics },
        { nazwa: 'Dynamika', app: dynamics },
        { nazwa: 'Statek Niestabilny', app: statekNiestabilny },
        { nazwa: 'Statek Stabilny', app: statekStabilny },
    ]
    // const [actualThreeApp, setActualThreeApp] = useState<() => Promise<WebGLRenderer> | undefined>()
    const przykladyThree: { nazwa: string, app: () => Promise<ThreeApp> }[] = [
        { nazwa: 'hello World Tree', app: heloWorldThree },
        { nazwa: '2dGraphics', app: d2Graphics },
        { nazwa: 'Statek', app: statek },
        { nazwa: 'Ruch Obrotowy', app: RuchObrotowy },
        // { nazwa: 'Ruch Obrotowy 2', app: RuchObrotowy2 }
    ]
    const PrzykladyThreeNew: { nazwa: string, app: () => Promise<CanvaApp> }[] = [
        { nazwa: 'Kolejne Podejscie', app: kolejnePodejscie }
    ]

    return (
        <>

            <Box sx={{ border: '1px dashed red', height: '100%' }}>
                <Button sx={{ height: '5%' }} variant='contained' onClick={() => { setShowBar((state) => !state) }}>{showBar ? 'schowaj' : 'pokaż'}</Button>


                <Box sx={{ border: '1px dashed green', height: '95%', display: 'flex' }} >
                    {
                        showBar && <Box sx={{
                            width: '20%',
                            maxWidth: '20em'
                        }} >
                            <Stack>
                                {przykladyPixi.map((przyklad) => {
                                    return <Button
                                        key={przyklad.nazwa}
                                        sx={{ margin: '3px' }}
                                        variant='contained'
                                        onClick={() => { setActualApp(<PixiApp app={przyklad.app} />) }}>
                                        {przyklad.nazwa}

                                    </Button>;
                                })}
                            </Stack>
                            <Stack>
                                {przykladyThree.map((przyklad) => {
                                    return <Button
                                        key={przyklad.nazwa}
                                        sx={{ margin: '3px', backgroundColor: 'red' }}
                                        variant='contained'
                                        onClick={() => { setActualApp(<ThreeAppComp app={przyklad.app} />) }}
                                    >
                                        {przyklad.nazwa}

                                    </Button>;
                                })}
                            </Stack>
                            <Stack>
                                {PrzykladyThreeNew.map((app) => {
                                    return <Button
                                        key={app.nazwa}
                                        sx={{ margin: '3px', backgroundColor: 'red' }}
                                        variant='contained'
                                        onClick={() => { setActualApp(<CanvaAppComponent app={app.app} />) }}
                                    >
                                        {app.nazwa}
                                    </Button>;
                                })}
                            </Stack>
                        </Box>
                    }

                    <Box sx={{ border: '1px dashed red', height: '100%', width: showBar ? '80%' : '100%' }}>
                        {
                            actualApp
                        }
                    </Box>
                </Box>
            </Box>
            {/* <Box sx={{ border: '1px dashed red', width: '100%', height: '100%' }}>
                <Typography variant='h1'>Hello World</Typography>
            </Box> */}
        </>
    );
}