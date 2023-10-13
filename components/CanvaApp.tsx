import React, { useEffect, useRef, useState } from "react"
import { CanvaApp } from "../App/Source/app";
import { Box } from "@mui/material";





const CanvaAppComponent = (props: { app: () => Promise<CanvaApp> }) => {
    let { app } = props;
    const ref = useRef<HTMLElement>();

    useEffect(() => {
        const promise = app();

        const observer = new ResizeObserver((entries) => {
            // wykonanie czynności po zmianie rozmiaru
            const width = ref.current?.offsetWidth || 0;
            const height = ref.current?.offsetHeight || 0;
            promise.then((app) => app.resize(width, height));
        });

        ref.current && observer.observe(ref.current);

        promise.then((app) => {
            if (ref.current) {
                ref.current?.appendChild(app.getHtmlElement());
                const width = ref.current.offsetWidth;
                const height = ref.current.offsetHeight;
                app.start(width, height);
            }
        })

        return () => {
            promise.then((app) => {
                app.stop();
            })
            ref.current && observer.unobserve(ref.current);
        }
    }, [app])

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
