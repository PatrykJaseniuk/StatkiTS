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
    let kadlub = new Kadlub();
    oddzialywatorPointerObiekt.add(kadlub);
    silnikFizyki.add(kadlub);
    scene.add(kadlub);
    rysowaczSil.addObiekt(kadlub);

    // let zagiel1 = new Zagiel();
    // zagiel1.position.set(10, 0, 0);
    // oddzialywatorPointerObiekt.add(zagiel1);
    // silnikFizyki.add(zagiel1);
    // scene.add(zagiel1);
    // rysowaczSil.addObiekt(zagiel1);

    // let zagiel2 = new Zagiel();
    // zagiel2.position.set(-10, 0, 0);
    // oddzialywatorPointerObiekt.add(zagiel2);
    // silnikFizyki.add(zagiel2);
    // scene.add(zagiel2);
    // rysowaczSil.addObiekt(zagiel2);

    // const wiazanie1 = new Wiazanie(
    //     { obiekt: kadlub, punktPrzyczepienia: new Vector3(10, 0, 0) },
    //     { obiekt: zagiel1, punktPrzyczepienia: new Vector3(0, 0, 0) },
    //     10
    // );
    // const wiazanie2 = new Wiazanie(
    //     { obiekt: kadlub, punktPrzyczepienia: new Vector3(-10, 0, 0) },
    //     { obiekt: zagiel2, punktPrzyczepienia: new Vector3(0, 0, 0) },
    //     10
    // );
    // silnikWiazan.addWiazanie(wiazanie1);
    // silnikWiazan.addWiazanie(wiazanie2);

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
    ticker.tick();

    return threeApp;
}

export default threeApp;

