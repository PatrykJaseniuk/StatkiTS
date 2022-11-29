import { useEffect, useRef, useState } from "react"
import { readConfigFile } from "typescript"
import app from "../game/helloWorld"


const Game = () => {
    const gameId = 'game'
    useEffect(() => {
        app.then((app) => {
            document.getElementById(gameId)?.appendChild(app.view as any);
            app.start();

            console.log('start')
        });
    }, [])

    return (
        <div id={gameId}></div>
    )
}
export default Game;
