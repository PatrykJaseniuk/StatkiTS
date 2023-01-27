// hello world bibloteki three.js w typescript
//
import { touchRippleClasses } from '@mui/material';
import { Renderer } from 'pixi.js';
import * as THREE from 'three';
import { Scene, Vector2 } from 'three';
import { canHaveDecorators } from 'typescript';
import { ThreeApp } from './ThreeApp';

async function threeApp() {
    const scene = new THREE.Scene();
    // const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const camera = new THREE.OrthographicCamera(-100, 100, 100, -100, -10, 1000);

    scene.add(camera);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(800, 800);

    let silnikFizyki = new SilnikFizyki();

    let oddzialywatorPointerObiekt = new OddzialywatorPointerObiekt(camera, renderer, scene);



    // on plane click print coordinates of plane in console


    //to jest pierwsza wersja tworzenai obiektu i dodawania go do kontenerów fizyki i sceny 
    let kadlub = new Kadlub();

    oddzialywatorPointerObiekt.add(kadlub);
    silnikFizyki.add(kadlub);
    scene.add(kadlub);

    // w wersji drugiej tworze obiekt, który w konstruktorze dodaje siebie do kontenerów fizyki i sceny
    // let obiektFizyczny = new ObiektFizyczny(plane, silnikFizyki);

    // make backgroud blue
    renderer.setClearColor(0x0000ff, 1);

    camera.position.z = 1;

    let ticker = new Ticker();
    ticker.addTickListener(() => {
        oddzialywatorPointerObiekt.oddzialywuj();
        silnikFizyki.aktualizuj();
        renderer.render(scene, camera);
    });

    let threeApp: ThreeApp = {
        renderer,
        stop: () => {
            ticker.stop();
            renderer.dispose();
        }
    };

    return threeApp;
}

class OddzialywatorPointerObiekt {
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    renderer: THREE.Renderer;
    reyCaster = new THREE.Raycaster();
    obiekty: (Pickable & ObiektFizyczny)[] = [];
    mousePosition = new THREE.Vector3();
    clickedObject: { object: THREE.Object3D, clickPositionOnObject: THREE.Vector3, line: THREE.Line } | undefined = undefined;
    constructor(camera: THREE.OrthographicCamera, renderer: THREE.Renderer, scene: THREE.Scene) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        renderer.domElement.addEventListener('pointermove', (event: PointerEvent) => { this.onPointerMove(event) });
        renderer.domElement.addEventListener('pointerdown', (event: PointerEvent) => { this.onPointerDown(event) });
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
        this.reyCaster.setFromCamera(this.mousePosition, this.camera);
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
                line: new THREE.Line(new THREE.BufferGeometry().setFromPoints([new Vector2(10, 10), new Vector2(30, 30)]), new THREE.LineBasicMaterial({ color: 0xff0000 }))
            };
            this.scene.add(this.clickedObject.line);
            // register single pointer up event
            this.renderer.domElement.addEventListener('pointerup', () => { this.clickedObject = undefined }, { once: true });
        }
    }
    onPointerMove(event: PointerEvent) {
        this.mousePosition.x = (event.offsetX / this.renderer.domElement.clientWidth) * 2 - 1;
        this.mousePosition.y = -(event.offsetY / this.renderer.domElement.clientHeight) * 2 + 1;
    }
    oddzialywuj() {
        this.reyCaster.setFromCamera(this.mousePosition, this.camera);
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



            this.clickedObject.line.geometry = new THREE.BufferGeometry().setFromPoints([this.clickedObject.object.position.clone().add(this.clickedObject.clickPositionOnObject), this.mousePosition]);
        }
    }
}

class Ticker {
    animationFrameID: number | undefined;
    constructor() {
        this.tick();
    }
    tick() {
        this.animationFrameID = requestAnimationFrame(() => this.tick());
        this.tickListeners.forEach((listener) => listener());
    }
    tickListeners: (() => void)[] = [];
    addTickListener(listener: () => void) {
        this.tickListeners.push(listener);
    }
    removeTickListener(listener: () => void) {
        this.tickListeners = this.tickListeners.filter((l) => l !== listener);
    }
    stop() {
        if (this.animationFrameID) {
            cancelAnimationFrame(this.animationFrameID);
        }
    }
}



class SilnikFizyki {
    remove(obiekt: ObiektFizyczny): void {
        this.obiektyFizyczne = this.obiektyFizyczne.filter((ob) => ob !== obiekt);
    }

    obiektyFizyczne: ObiektFizyczny[] = [];
    add(obiek: ObiektFizyczny) {
        this.obiektyFizyczne.push(obiek);
    }
    constructor() {

    }
    aktualizuj() {
        this.obiektyFizyczne.forEach((obiekt) => obiekt.aktualizuj());
        // console.log(this.obiektyFizyczne[0].predkosc)
    }
}



class ObiektFizyczny extends THREE.Mesh {
    // silnikFizyki: SilnikFizyki;
    constructor(mesh: THREE.Mesh) {
        super(mesh.geometry, mesh.material);
        // this.silnikFizyki = silnikFizyki;
        // silnikFizyki.add(this);
        this.predkosc = new THREE.Vector2(1, 0);
    }
    // destroy(): void {
    //     this.silnikFizyki.remove(this);
    // }
    aktualizuj() {
        this.aktualizujSile();
        this.aktualizujPrzyspieszenie();
        this.aktualizujPredkosc();
        this.aktualizujPolozenie();
    }
    aktualizujSile() {
        let skladowaWO = this.predkosc.lengthSq(); //skladowa wektora oporu jest rowna kwadratowi dlugosci wektora predkosci co powoduje, że model fuzyki może eksplodować dla zbyt dużej predkosci. Aby temu zapobiec muszę wprowadzić ograniczenie że zmiana predkosci nie może być wieksza od predkości

        let dlugoscWektoraOporu = skladowaWO * -0.01 - 0.01;
        this.silaOporu = this.predkosc.clone().normalize().multiplyScalar(dlugoscWektoraOporu);

        this.sila = this.silaPrzeciagania.clone().add(this.silaOporu);
    }
    aktualizujPrzyspieszenie() {
        this.przyspieszenie = this.sila.clone().divideScalar(this.masa);
    }
    aktualizujPredkosc() {
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
    aktualizujPolozenie() {
        this.position.x += this.predkosc.x;;
        this.position.y += this.predkosc.y;;

    }



    predkosc: Vector2 = new Vector2(0, 0);
    przyspieszenie: Vector2 = new Vector2(0, 0);
    silaPrzeciagania: Vector2 = new Vector2(0, 0);
    private silaOporu: Vector2 = new Vector2(0, 0);
    private sila: Vector2 = new Vector2(0, 0);
    silaoporu: Vector2 = new Vector2(0, 0);
    masa: number = 1;
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

        this.masa = 5;
    }

}

export default threeApp;

