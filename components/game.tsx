import { useEffect, useRef } from "react"
import { readConfigFile } from "typescript"
import { app } from "../game/helloWorld"

const Game = () => {
    const ref = useRef(null)
    // useEffect(() => {
    //     // On first render add app to DOM
    //     // (ref.current as any).addchild(app.view);
    //     // Start the PixiJS app
    //     app.start();

    //     return () => {
    //         // On unload stop the application
    //         app.stop();
    //     };
    // }, []);
    // return <div ref={ref}></div>
}
export default Game;
