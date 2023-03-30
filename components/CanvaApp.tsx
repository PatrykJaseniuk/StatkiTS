import { Container, Typography } from "@mui/material";
import { border, Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react"
import { WebGLRenderer } from "three";
import { isPropertySignature, readConfigFile } from "typescript"
import { CanvaApp } from "../appsThree/KolejnePodejscie/app";



const CanvaAppComponent = (props: { app: () => Promise<CanvaApp> }) => {
    let { app } = props;
    const ref = useRef(null);

    useEffect(() => {
        console.log('useEffect')
        let promise = app();
        promise.then((app) => {
            (ref.current as unknown as HTMLElement).appendChild(app.getHtmlElement() as any);
            console.log('mount threeApp')
            app.start();
        })
        return () => {
            promise.then((app) => {
                app.stop();
                if (ref.current) {
                    (ref.current as any).innerHTML = '';
                }
            })
            console.log('unmount threeApp')
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
export default CanvaAppComponent;
