import React, { useEffect, useRef, useState } from "react"
import { CanvaApp } from "../App/Source/app";
import { Box } from "@mui/material";

const CanvaAppComponent = (props: { app: () => Promise<CanvaApp> }) => {
    const { app: getApp } = props;
    const ref = useRef<HTMLElement>();

    useEffect(() => {
        let stopAll = () => { };

        (async () => {
            const appp = await getApp();

            stopAll = ref.current ?
                ref.current.appendChild(appp.getHtmlElement()) &&
                (() => {
                    const width = ref.current?.offsetWidth;
                    const height = ref.current?.offsetHeight;
                    const observer = new ResizeObserver((entries) => {
                        // wykonanie czynności po zmianie rozmiaru
                        const width = ref.current?.offsetWidth || 0;
                        const height = ref.current?.offsetHeight || 0;
                        appp.resize(width, height);
                    });

                    ref.current && observer.observe(ref.current);
                    const stopApp = appp.start(width, height);

                    return () => {
                        stopApp();
                        ref.current && observer.unobserve(ref.current);
                    }
                })()
                :
                () => { }

        })()

        return () => stopAll()
    }, [getApp])

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
