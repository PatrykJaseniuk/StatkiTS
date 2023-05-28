import React, { useEffect, useRef, useState } from "react"
import { CanvaApp } from "../App/Source/app";
import { Box } from "@mui/material";





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

            <Box
                //  wyświetl komponent Box w leym górnym rogu ekranu
                sx={{
                    position: 'absolute',
                    top: '0px',
                    left: '0px',
                    border: '0px red solid',
                    padding: '10px',
                    // czrne tło
                    bgcolor: 'black',
                    color: 'white',
                    fontSize: '10px',
                    fontFamily: 'monospace',

                }}
            >
                <div>
                    wskaźnik nad masztem:
                    <ul>
                        <li>LMB - obróć żagiel w lewo</li>
                        <li>RMB - obróć żagiel w prawo</li>
                        <li>scroll - rozwiń zwiń żagiel</li>
                    </ul>
                </div>
                <div>wskaźnik nad sterem: </div>
                <ul>
                    <li>LMB - obróć w lewo</li>
                    <li>RMB - obróć w prawo</li>
                </ul>
                <div> sterowanie czasem:
                    <ul>
                        <li>Q - zwolnij</li>
                        <li>E - przyspiesz</li>
                    </ul>
                </div>
            </Box>
        </Box>
    )
}
export default CanvaAppComponent;
