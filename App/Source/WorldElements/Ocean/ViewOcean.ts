import { Water } from './Water.js';
import { Sky } from './Sky.js';
import * as THREE from 'three';

export class Ocean {

    sky;
    water;
    constructor() {

        // Water
        const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

        const water: any = new Water(
            waterGeometry,
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new THREE.TextureLoader().load('waternormals.jpg', function (texture) {

                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

                }),
                sunDirection: new THREE.Vector3(),
                sunColor: 0xffffff,
                waterColor: 0x001e0f,
                distortionScale: 3.7,
                // fog: scene.fog !== undefined
            }
        );

        water.rotation.x = - Math.PI / 2;

        this.water = water;

        const sun = new THREE.Vector3();
        // Skybox

        const sky: any = new Sky();
        sky.scale.setScalar(10000);
        this.sky = sky;

        const skyUniforms = sky.material.uniforms;

        skyUniforms['turbidity'].value = 10;
        skyUniforms['rayleigh'].value = 2;
        skyUniforms['mieCoefficient'].value = 0.005;
        skyUniforms['mieDirectionalG'].value = 0.8;

        const parameters = {
            elevation: 2,
            azimuth: 180
        };

        // const pmremGenerator = new THREE.PMREMGenerator(renderer);
        // let renderTarget;



        const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
        const theta = THREE.MathUtils.degToRad(parameters.azimuth);

        sun.setFromSphericalCoords(1, phi, theta);

        sky.material.uniforms['sunPosition'].value.copy(sun);
        water.material.uniforms['sunDirection'].value.copy(sun).normalize();

        // if (renderTarget !== undefined) renderTarget.dispose();

        // renderTarget = pmremGenerator.fromScene(sky);

        // scene.environment = renderTarget.texture;

        //
    }
}
