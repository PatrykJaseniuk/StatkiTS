// hello world bibloteki three.js w typescript
//
import { touchRippleClasses } from '@mui/material';
import { type } from 'os';
import { Renderer } from 'pixi.js';
import * as THREE from 'three';
import { Scene, Vector2, Vector3 } from 'three';
import { randFloat, randInt } from 'three/src/math/MathUtils';
import { canHaveDecorators, textSpanIntersectsWith } from 'typescript';
import { ThreeApp } from './ThreeApp';

async function threeApp() {
    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(-100, 100, 100, -100, -10, 1000);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(800, 800);

    const gotowyRenderer: GotowyRenderer = new GotowyRenderer(scene, camera, renderer);
    const rysowaczSil = new RysowaczSil(scene);
    const silnikFizyki = new SilnikFizyki(rysowaczSil);
    const oddzialywatorPointerObiekt = new OddzialywatorPointerObiekt(camera, renderer);
    const silnikWiazan = new SilnikWiazan();

    const ticker = new Ticker();
    ticker.addStateModifier(oddzialywatorPointerObiekt);
    ticker.addStateModifier(silnikFizyki);
    ticker.addStateModifier(gotowyRenderer);
    ticker.addStateModifier(rysowaczSil);
    ticker.addStateModifier(silnikWiazan);

    //to jest pierwsza wersja tworzenai obiektu i dodawania go do kontenerów fizyki i sceny 
    let kadlub = new Kadlub();
    // oddzialywatorPointerObiekt.add(kadlub);
    silnikFizyki.add(kadlub);
    scene.add(kadlub);
    rysowaczSil.addObiekt(kadlub);

    let zagiel = new Zagiel();
    oddzialywatorPointerObiekt.add(zagiel);
    silnikFizyki.add(zagiel);
    scene.add(zagiel);
    rysowaczSil.addObiekt(zagiel);




    const wiazanie = new Wiazanie(kadlub, zagiel, 10);
    silnikWiazan.addWiazanie(wiazanie);

    // w wersji drugiej tworze obiekt, który w konstruktorze dodaje siebie do kontenerów fizyki i sceny
    // let obiektFizyczny = new ObiektFizyczny(plane, silnikFizyki);

    // make backgroud blue
    renderer.setClearColor(0x0000ff, 1);

    camera.position.z = 1;

    const threeApp: ThreeApp = {
        renderer,
        stop: () => {
            ticker.stop();
            renderer.dispose();
        }
    };

    return threeApp;
}

interface MousePosition {
    ndc: THREE.Vector3,
    worldSpace: THREE.Vector3
}

interface ClickedObject {
    object: THREE.Object3D,
    clickPositionOnObject: THREE.Vector3,
    // line: THREE.Line
}

class Ticker {
    animationFrameID: number | undefined;
    silnikFizyki: SilnikFizyki | undefined;
    rysowaczSil: RysowaczSil | undefined;
    gotowyRenderer: GotowyRenderer | undefined;
    oddzialywatorPointerObiekt: OddzialywatorPointerObiekt | undefined;
    silnikWiazan: SilnikWiazan | undefined;
    constructor() {
        this.tick();
    }
    addStateModifier(stateModifier: SilnikFizyki | RysowaczSil | OddzialywatorPointerObiekt | GotowyRenderer | SilnikWiazan) {
        if (stateModifier instanceof SilnikFizyki) {
            this.silnikFizyki = stateModifier;
        }
        else if (stateModifier instanceof RysowaczSil) {
            this.rysowaczSil = stateModifier;
        }
        else if (stateModifier instanceof OddzialywatorPointerObiekt) {
            this.oddzialywatorPointerObiekt = stateModifier;
        }
        else if (stateModifier instanceof GotowyRenderer) {
            this.gotowyRenderer = stateModifier;
        }
        else if (stateModifier instanceof SilnikWiazan) {
            this.silnikWiazan = stateModifier;
        }
    }


    tick() {
        this.animationFrameID = requestAnimationFrame(() => this.tick());
        // this.tickListeners.forEach((listener) => listener());

        this.oddzialywatorPointerObiekt?.poczatekKlatki();
        this.silnikWiazan?.wyznaczSily();
        this.silnikFizyki?.poczatekKlatki();
        this.rysowaczSil?.poczatekKlatki();

        this.gotowyRenderer?.poczatekKlatki();

        this.rysowaczSil?.koniecKlatki();
        this.silnikFizyki?.koniecKlatki();
        this.oddzialywatorPointerObiekt?.koniecKlatki();



    }
    // tickListeners: (() => void)[] = [];
    // addTickListener(listener: () => void) {
    //     this.tickListeners.push(listener);
    // }
    // removeTickListener(listener: () => void) {
    //     this.tickListeners = this.tickListeners.filter((l) => l !== listener);
    // }
    stop() {
        if (this.animationFrameID) {
            cancelAnimationFrame(this.animationFrameID);
        }
    }
}

class OddzialywatorPointerObiekt {
    // scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    renderer: THREE.Renderer;
    reyCaster = new THREE.Raycaster();
    obiekty: (Pickable & ObiektFizyczny)[] = [];
    mousePosition: MousePosition = {
        ndc: new THREE.Vector3(0),
        worldSpace: new THREE.Vector3(0)
    };
    clickedObject: ClickedObject | undefined = undefined;

    constructor(camera: THREE.OrthographicCamera, renderer: THREE.Renderer) {
        // this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        renderer.domElement.addEventListener('pointermove', (event: PointerEvent) => { this.onPointerMove(event) });
        renderer.domElement.addEventListener('pointerdown', (event: PointerEvent) => { this.onPointerDown(event) });
    }
    poczatekKlatki() {

        this.oddzialywuj();
    }
    koniecKlatki() {

    }
    destructor() {
        this.renderer.domElement.removeEventListener('pointermove', (event: PointerEvent) => { this.onPointerMove(event) });
        this.renderer.domElement.removeEventListener('pointerdown', (event: PointerEvent) => { this.onPointerDown(event) });
    }
    add(obiekt: Pickable & ObiektFizyczny) {
        this.obiekty.push(obiekt);
    }
    remove(obiekt: Pickable) {
        this.obiekty = this.obiekty.filter((ob) => ob !== obiekt);
    }
    onPointerDown(event: PointerEvent) {
        this.reyCaster.setFromCamera(this.mousePosition.ndc, this.camera);
        let intersects = this.reyCaster.intersectObjects(this.obiekty);
        if (intersects.length > 0) {
            // get camera width and height
            let width = this.camera.right - this.camera.left;
            let height = this.camera.top - this.camera.bottom;
            let mousePositionInWorldSpace = new THREE.Vector3(
                (event.offsetX / this.renderer.domElement.clientWidth) * width + this.camera.left,
                -(event.offsetY / this.renderer.domElement.clientHeight) * height + this.camera.top,
                0
            )
            this.clickedObject = {
                object: intersects[0].object,
                clickPositionOnObject: mousePositionInWorldSpace.sub(intersects[0].object.position),
                // line: new THREE.Line(new THREE.BufferGeometry().setFromPoints([new Vector2(10, 10), new Vector2(30, 30)]), new THREE.LineBasicMaterial({ color: 0xff0000 }))
            };
            // this.scene.add(this.clickedObject.line);
            // register single pointer up event
            this.renderer.domElement.addEventListener('pointerup', () => { this.onPointerUp() }, { once: true });
        }
    }
    onPointerUp() {
        // usun linie ze sceny  
        if (this.clickedObject !== undefined) {
            // this.scene.remove(this.clickedObject.line);
            this.clickedObject = undefined;
        }
    }

    onPointerMove(event: PointerEvent) {
        this.mousePosition.ndc.x = (event.offsetX / this.renderer.domElement.clientWidth) * 2 - 1;
        this.mousePosition.ndc.y = -(event.offsetY / this.renderer.domElement.clientHeight) * 2 + 1;
        this.mousePosition.worldSpace.x = this.mousePosition.ndc.x * this.camera.right;
        this.mousePosition.worldSpace.y = this.mousePosition.ndc.y * this.camera.top;

    }
    oddzialywuj() {
        this.reyCaster.setFromCamera(this.mousePosition.ndc, this.camera);
        this.obiekty.forEach((obiekt) => {
            obiekt.isPicked(false);
        });
        let intersects = this.reyCaster.intersectObjects(this.obiekty);
        if (intersects.length > 0) {
            intersects.forEach((inter) => {
                let obiekt = inter.object as Pickable & ObiektFizyczny;
                obiekt.isPicked(true);
            });
        }

        if (this.clickedObject) {
            // const rysujLinie = (clickedObject: ClickedObject, mousePosition: MousePosition) => {
            //     clickedObject.line.geometry = new THREE.BufferGeometry().setFromPoints(
            //         [clickedObject.object.position.clone().add(clickedObject.clickPositionOnObject),
            //         mousePosition.worldSpace]
            //     );
            // }
            const generujSile = (clickedObject: ClickedObject, mousePosition: MousePosition) => {
                if (clickedObject.object instanceof ObiektFizyczny) {
                    let sila = mousePosition.worldSpace.clone().sub(clickedObject.object.position.clone().add(clickedObject.clickPositionOnObject));
                    clickedObject.object.addForce(sila);
                }

            }
            // rysujLinie(this.clickedObject, this.mousePosition);
            generujSile(this.clickedObject, this.mousePosition);
        }
    }
}

class GotowyRenderer {
    constructor(scene: THREE.Scene, camera: THREE.OrthographicCamera, renderer: THREE.Renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
    }
    poczatekKlatki() {
        this.renderer.render(this.scene, this.camera);
    }
    koniecKlatki() {

    }
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    renderer: THREE.Renderer;

}
class RysowaczSil {


    constructor(scene: THREE.Scene) {
        this.scene = scene;
    }
    poczatekKlatki() {
        this.obiekty.forEach((obiekt) => {
            obiekt.sily.forEach((sila) => {
                this.rysujSile(sila, obiekt.position);
            })

        });
    }
    koniecKlatki() {
        this.strzalki.forEach((strzalka) => {
            this.scene.remove(strzalka);
        });
        this.strzalki = [];
    }
    addObiekt(obiekt: ObiektFizyczny) {
        this.obiekty.push(obiekt);
    }

    private obiekty: ObiektFizyczny[] = [];
    private strzalki: THREE.ArrowHelper[] = [];
    private scene: THREE.Scene;
    private rysujSile(sila: THREE.Vector3, polozenie: THREE.Vector3) {
        const arrowHelper = new THREE.ArrowHelper(sila.clone().normalize(), polozenie, sila.length(), 0xff0000);
        this.strzalki.push(arrowHelper);
        this.scene.add(arrowHelper);
    }
}

class SilnikFizyki {
    constructor(rysowaczSil?: RysowaczSil) {
    }
    poczatekKlatki() {
        this.obiektyFizyczne.forEach((obiekt) => {
            obiekt.poczatekKlatki();
        });
    }
    koniecKlatki() {
        this.obiektyFizyczne.forEach((obiekt) => {
            obiekt.koniecKlatki();
        });
    }

    rysowaczSil: RysowaczSil | undefined;
    remove(obiekt: ObiektFizyczny): void {
        this.obiektyFizyczne = this.obiektyFizyczne.filter((ob) => ob !== obiekt);
    }
    obiektyFizyczne: ObiektFizyczny[] = [];
    add(obiek: ObiektFizyczny) {
        this.obiektyFizyczne.push(obiek);
    }
    // aktualizuj() {
    //     this.obiektyFizyczne.forEach((obiekt) => {
    //         obiekt.aktualizuj(this.rysowaczSil);
    //     });
    // }
}

class SilnikWiazan {
    constructor() {
    }
    wyznaczSily() {
        this.wiazania.forEach((wiazanie) => {
            wiazanie.wyzanczSily();
        });
    }
    wiazania: Wiazanie[] = [];
    addWiazanie(wiazanie: Wiazanie) {
        this.wiazania.push(wiazanie);
    }
}

class ObiektFizyczny extends THREE.Mesh {
    poczatekKlatki() {
        this.aktualizujSile();
        this.aktualizujPrzyspieszenie();
        this.aktualizujPredkosc();
        this.aktualizujPolozenie();
    }
    koniecKlatki() {
        this.sily = [];
    }

    // silnikFizyki: SilnikFizyki;
    constructor(mesh: THREE.Mesh) {
        super(mesh.geometry, mesh.material);
        // this.silnikFizyki = silnikFizyki;
        // silnikFizyki.add(this);
        this.predkosc = new THREE.Vector3(1, 0);
    }
    sily: THREE.Vector3[] = [];
    predkosc: Vector3 = new Vector3(0);
    przyspieszenie: Vector3 = new Vector3(0);
    private sila: Vector3 = new Vector3(0);
    masa: number = 1;

    addForce(sila: THREE.Vector3) {
        this.sily.push(sila);
    }

    // aktualizuj() {
    //     this.aktualizujSile();
    //     this.aktualizujPrzyspieszenie();
    //     this.aktualizujPredkosc();
    //     this.aktualizujPolozenie();
    // }
    private aktualizujSile() {

        this.sila = new THREE.Vector3(0);

        let skladowaWO = this.predkosc.lengthSq(); //skladowa wektora oporu jest rowna kwadratowi dlugosci wektora predkosci co powoduje, że model fuzyki może eksplodować dla zbyt dużej predkosci. Aby temu zapobiec muszę wprowadzić ograniczenie że zmiana predkosci nie może być wieksza od predkości

        let dlugoscWektoraOporu = skladowaWO * -1 - 0.2;
        let silaOporu = this.predkosc.clone().normalize().multiplyScalar(dlugoscWektoraOporu);

        this.sily.push(silaOporu);
        this.sily.forEach((sila) => {
            this.sila.add(sila);
        });
        this.sila.divideScalar(10)
    }
    private aktualizujPrzyspieszenie() {
        this.przyspieszenie = this.sila.clone().divideScalar(this.masa);
    }
    private aktualizujPredkosc() {
        let przyspieszeniePomocnicze = this.przyspieszenie.clone();

        // przyspieszenie w przeciwnym kierunku niż prędkość nie mozę być większe od prędkości, bo obiekt fizyczny zaczyna drgać, a jeżeli jest dwa razy większe to obiekt przesuwa się w nieskończoność
        if (Math.sign(this.przyspieszenie.x) != Math.sign(this.predkosc.x) && this.predkosc.x != 0) {
            if (Math.abs(this.przyspieszenie.x) > Math.abs(this.predkosc.x)) {
                this.predkosc.x = 0;
                przyspieszeniePomocnicze.x = 0;
                console.log('przyspieszenie x zbyt duze: ', this.przyspieszenie.x)
            }
        }
        if (Math.sign(this.przyspieszenie.y) != Math.sign(this.predkosc.y) && this.predkosc.y != 0) {
            if (Math.abs(this.przyspieszenie.y) > Math.abs(this.predkosc.y)) {
                this.predkosc.y = 0;
                przyspieszeniePomocnicze.y = 0;
                console.log('przyspieszenie y zbyt duze: ', this.przyspieszenie.y)

            }
        }
        this.predkosc.add(przyspieszeniePomocnicze);
    }
    private aktualizujPolozenie() {
        this.position.x += this.predkosc.x;
        this.position.y += this.predkosc.y;
    }

}

interface Pickable {
    isPicked(isPicked: boolean): void;
}

class Kadlub extends ObiektFizyczny implements Pickable {
    isPicked(isPicked: boolean) {
        if (isPicked) {
            this.planeMat.color = this.pickedColor;
        } else {
            this.planeMat.color = new THREE.Color(0xffffff);
        }
    }
    planeMat: THREE.MeshBasicMaterial;
    pickedColor: THREE.Color = new THREE.Color(0xff0000);

    constructor() {
        // add picture to scene
        const loader = new THREE.TextureLoader();
        const texture = loader.load('kadlub.png');
        const planeGeo = new THREE.PlaneGeometry(30, 10);
        const planeMat = new THREE.MeshBasicMaterial({
            map: texture,
        });
        const plane = new THREE.Mesh(planeGeo, planeMat);
        super(plane);
        this.position.set(-50, 0, 0);

        this.planeMat = planeMat;

        this.masa = 10;
    }

}

class Zagiel extends ObiektFizyczny implements Pickable {
    isPicked(isPicked: boolean) { };
    constructor() {
        // add picture to scene
        const loader = new THREE.TextureLoader();
        const texture = loader.load('zagiel.png');
        const planeGeo = new THREE.PlaneGeometry(10, 10);
        const planeMat = new THREE.MeshBasicMaterial({
            map: texture,
        });
        const plane = new THREE.Mesh(planeGeo, planeMat);
        super(plane);
        this.position.set(0, 0, 0);

        this.masa = 1;
    }
}

class Wiazanie {
    constructor(private obiekt1: ObiektFizyczny, private obiekt2: ObiektFizyczny, private sprezystosc: number) { }

    wyzanczSily() {
        let sila = this.obiekt1.position.clone().sub(this.obiekt2.position);
        sila.multiplyScalar(this.sprezystosc);
        this.obiekt2.addForce(sila);
        this.obiekt1.addForce(sila.clone().multiplyScalar(-1));
    }
}

export default threeApp;

