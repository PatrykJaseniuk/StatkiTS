// hello world bibloteki three.js w typescript
//
import * as THREE from 'three';
import { GotowyRenderer } from './ModyfikatoryStanuITIcker/GotowyRenderer';
import { OddzialywatorPointerObiekt } from './ModyfikatoryStanuITIcker/OddzialywatorPointerObiekt';
import { RysowaczSil } from './ModyfikatoryStanuITIcker/RysowaczSil';
import { SilnikFizyki } from './ModyfikatoryStanuITIcker/SilnikFizyki';
import { SilnikWiazan } from './ModyfikatoryStanuITIcker/SilnikWiazan';
import { ThreeApp } from '../ThreeApp';
import { Kadlub } from './Obiekty/Kadlub';
import { Zagiel } from './Obiekty/Zagiel';
import { Wiazanie } from './Obiekty/Wiazanie';
import { Ticker } from './ModyfikatoryStanuITIcker/Ticker';
import { Vector3 } from 'three';
import { ObiektFizyczny } from './Obiekty/ObiektFizyczny';

async function threeApp() {
    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(-100, 100, 100, -100, -10, 1000);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(800, 800);

    const gotowyRenderer: GotowyRenderer = new GotowyRenderer(scene, camera, renderer);
    const rysowaczSil = new RysowaczSil(scene);
    const silnikFizyki = new SilnikFizyki();
    const oddzialywatorPointerObiekt = new OddzialywatorPointerObiekt(camera, renderer);
    const silnikWiazan = new SilnikWiazan();

    const ticker = new Ticker();
    ticker.addStateModifier(oddzialywatorPointerObiekt);
    ticker.addStateModifier(silnikFizyki);
    ticker.addStateModifier(gotowyRenderer);
    ticker.addStateModifier(rysowaczSil);
    ticker.addStateModifier(silnikWiazan);

    //to jest pierwsza wersja tworzenai obiektu i dodawania go do kontenerów fizyki i sceny 
    // let kadlub = new Kadlub();
    // oddzialywatorPointerObiekt.add(kadlub);
    // silnikFizyki.add(kadlub);
    // scene.add(kadlub);
    // rysowaczSil.addObiekt(kadlub);

    let redDot = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    let punkt1 = new ObiektFizyczny(redDot);
    punkt1.position.x = 10;
    let punkt2 = new ObiektFizyczny(redDot.clone());
    punkt2.position.x = -10;
    let punkt3 = new ObiektFizyczny(redDot.clone());
    punkt3.position.y = 10;

    oddzialywatorPointerObiekt.add(punkt1);
    oddzialywatorPointerObiekt.add(punkt2);
    oddzialywatorPointerObiekt.add(punkt3);

    silnikFizyki.add(punkt2);
    silnikFizyki.add(punkt1);
    silnikFizyki.add(punkt3);

    scene.add(punkt1);
    scene.add(punkt2);
    scene.add(punkt3);

    rysowaczSil.addObiekt(punkt1);
    rysowaczSil.addObiekt(punkt2);
    rysowaczSil.addObiekt(punkt3);

    let wiazanie1 = new Wiazanie(punkt1, punkt2, 1, 10);
    let wiazanie2 = new Wiazanie(punkt2, punkt3, 1, 10);
    let wiazanie3 = new Wiazanie(punkt3, punkt1, 1, 10);

    silnikWiazan.addWiazanie(wiazanie1);
    silnikWiazan.addWiazanie(wiazanie2);
    silnikWiazan.addWiazanie(wiazanie3);



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
    ticker.start();

    return threeApp;
}

export default threeApp;

