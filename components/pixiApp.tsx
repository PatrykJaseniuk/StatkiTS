import { Container, Typography } from "@mui/material";
import { border, Box } from "@mui/system";
import App from "next/app";
import { Application, ICanvas } from "pixi.js";
import React, { useEffect, useRef, useState } from "react"
import { isPropertySignature, readConfigFile } from "typescript"



const PixiApp = (props: { app: () => Promise<Application<ICanvas>> }) => {
    let { app } = props;
    const ref = useRef(null);
    const [gameId, setGameId] = useState('gameId' + (Math.random() * 100));

    useEffect(() => {
        (ref.current as unknown as JSX.Element)
        let promise = app();
        promise.then((app) => {
            (ref.current as unknown as HTMLElement).appendChild(app.view as any);
            app.start();
            console.log('koniec')
        })
        return () => {
            promise.then((app) => {
                app.stop();
                app.destroy(true);
                if (ref.current) {
                    (ref.current as any).innerHTML = '';
                }
            })
        }
    }, [app])
    return (
        <React.Fragment>
            <div></div>
            <Container ref={ref}
                sx={{
                    border: '1px red solid',
                    padding: '3px',
                    width: 'fit-content',
                }}
            >
                {/* <Typography>pixiApp</Typography> */}
                {/* <div ref={ref}></div> */}
            </Container>
        </React.Fragment >
    )
}
export default PixiApp;
