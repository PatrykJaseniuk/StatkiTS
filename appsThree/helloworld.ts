// hello world bibloteki three.js w typescript
//
import * as THREE from 'three';
import { ThreeApp } from './ThreeApp';

async function threeApp() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const _2dCamera = new THREE.OrthographicCamera(0, window.innerWidth, 0, window.innerHeight, 0, 1000);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xff0000 }));
    sprite.position.set(0, 0, 0);
    sprite.scale.set(100, 100, 1);
    scene.add(sprite);

    camera.position.z = 5;


    let frameID: number;
    function animate() {
        frameID = requestAnimationFrame(animate);
        //co robi powyższa funkcja? 
        //https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame


        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(scene, camera);
        console.log('ThreeJS hello world frame ID: ' + frameID);
    };

    animate();

    let threeApp: ThreeApp = {
        renderer: renderer,
        stop: () => {
            cancelAnimationFrame(frameID);
        }
    }
    return threeApp;
}


export default threeApp;

