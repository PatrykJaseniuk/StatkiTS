import { Container, Typography } from "@mui/material";
import { border, Box } from "@mui/system";
import React, { useEffect, useRef, useState } from "react"
import { WebGLRenderer } from "three";
import { isPropertySignature, readConfigFile } from "typescript"
import { CanvaApp } from "../appsThree/KolejnePodejscie/app";



const CanvaAppComponent = (props: { app: () => Promise<CanvaApp> }) => {
    let { app } = props;
    const ref = useRef(null);
    let width = 10;
    let height = 20;

    useEffect(() => {
        console.log('useEffect')
        let promise = app();
        promise.then((app) => {
            (ref.current as unknown as HTMLElement).appendChild(app.getHtmlElement() as any);
            console.log('mount threeApp')
            if (ref.current) {
                width = (ref.current as any).offsetWidth;
                height = (ref.current as any).offsetHeight;
            }
            app.start(width, height);


            console.log('width', width)
            console.log('height', height)
        })

        const observer = new ResizeObserver((entries) => {
            // wykonanie czynności po zmianie rozmiaru
            width = (ref.current as any)?.offsetWidth;
            height = (ref.current as any)?.offsetHeight;
            console.log('width', width)
            console.log('height', height)
            promise.then((app) => {
                app.resize(width, height);
            });

        });

        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            promise.then((app) => {
                app.stop();
                if (ref.current) {
                    (ref.current as any).innerHTML = '';
                }
            })
            if (ref.current) {
                observer.unobserve(ref.current);
            }
            console.log('unmount threeApp')
        }
    }, [app])

    useEffect(() => {


        return () => {

        };
    }, []);

    return (

        <Box ref={ref}
            sx={{
                border: '0px blue solid',
                padding: '0px',
                width: '100%',
                height: '100%',
            }}
        >
            {/* <Typography>pixiApp</Typography> */}
            {/* <div ref={ref}></div> */}
            {/* width {width}
            height {height} */}
        </Box>
    )
}
export default CanvaAppComponent;
