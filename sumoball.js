import * as THREE from "./libs/three.js/r131/three.module.js"
import {addMouseHandler} from "./sceneHandlers.js"
import * as dat from "./libs/dat.gui.module.js"
import { OBJLoader } from '../libs/three.js/r131/loaders/OBJLoader.js';
import { MTLLoader } from '../libs/three.js/r131/loaders/MTLLoader.js';

let renderer = null, scene = null, camera = null,  sphere = null,  sphereGroup = null;

const duration = 5000; // ms
let currentTime = Date.now();

function main() 
{
    const canvas = document.getElementById("webglcanvas");
    createScene(canvas);
    update();
}

/**
 * Updates the rotation of the objects in the scene
 */
function animate() 
{
    const now = Date.now();
    const deltat = now - currentTime;
    currentTime = now;
    const fract = deltat / duration;
    const angle = Math.PI * 2 * fract;

    // Rotate the sphere group about its Y axis
    // sphereGroup.rotation.y -= angle / 2;
    // sphere.rotation.x += angle * 2;

 
}

/**
 * Runs the update loop: updates the objects in the scene
 */
function update()
{
    requestAnimationFrame(function() { update(); });
    
    // Render the scene
    renderer.render( scene, camera );

    // Spin the cube for next frame
    animate();
}

/**
 * Creates a basic scene with lights, a camera, and 3 objects
 * @param {canvas} canvas The canvas element to render on
 */
function createScene(canvas)
{   
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);
    
    // Create a new Three.js scene
    scene = new THREE.Scene();

    const textureLoader = new THREE.TextureLoader();

    // Set the background color 
    scene.background = textureLoader.load("./resources/textures/checkeredTexture.jpeg")

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.z = 10;
    scene.add(camera);
    

    const listener = new THREE.AudioListener();
    camera.add( listener );

    // create a global audio source
    const sound = new THREE.Audio( listener );

    // load a sound and set it as the Audio object's buffer
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( './resources/sounds/song.mp3', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setLoop( true );
        sound.setVolume( 1 );
    });
    sound.play();
    // Add a directional light to show off the objects
    const light = new THREE.DirectionalLight( 0xffffff, 1.0);

    // Position the light out from the scene, pointing at the origin
    light.position.set(-.5, .2, 1);
    light.target.position.set(0,-2,0);
    scene.add(light);

    // This light globally illuminates all objects in the scene equally.
    // Cannot cast shadows
    const ambientLight = new THREE.AmbientLight(0xffccaa, 0.2);
    scene.add(ambientLight);

    const textureUrl = "./resources/textures/checkeredTexture.jpeg";
    const texture = new THREE.TextureLoader().load(textureUrl);
    const material = new THREE.MeshPhongMaterial({ map: texture });

    var sphereGroup = new THREE.Object3D();
    // Move the sphere group up and back from the cube
    sphereGroup.position.set(1, 0, -0.5);

    // Create the sphere geometry
    var geometry = new THREE.SphereGeometry(1, 20, 20);
    
    // And put the geometry and material together into a mesh
    sphere = new THREE.Mesh(geometry, material);

    // Add the sphere mesh to our group
    sphereGroup.add( sphere );

    // Create the cone geometry
    geometry = new THREE.CylinderGeometry(0, .333, .444, 20, 20);

    
    // Now add the group to our scene
    scene.add( sphereGroup );

    // add mouse handling so we can rotate the scene
    addMouseHandler(canvas, sphereGroup);

  
    sphereGroup.updateMatrixWorld();

    // DAT.GUI
    const gui = new dat.GUI();
    const sphereGroupFolder = gui.addFolder("Sphere Rotation");
    sphereGroupFolder.add(sphereGroup.rotation,"x",0,Math.PI*2).name("Rotate X");
    sphereGroupFolder.add(sphereGroup.rotation,"y",0,Math.PI*2).name("Rotate Y");
    sphereGroupFolder.add(sphereGroup.rotation,"z",0,Math.PI*2).name("Rotate Z");
    // sphereGroupFolder.open();
}

async function loadObj(objModelUrl, objectList)
{
    try
    {
        const object = await new OBJLoader().loadAsync(objModelUrl.obj, onProgress, onError);
        let texture = objModelUrl.hasOwnProperty('normalMap') ? new THREE.TextureLoader().load(objModelUrl.map) : null;
        let normalMap = objModelUrl.hasOwnProperty('normalMap') ? new THREE.TextureLoader().load(objModelUrl.normalMap) : null;
        let specularMap = objModelUrl.hasOwnProperty('specularMap') ? new THREE.TextureLoader().load(objModelUrl.specularMap) : null;

        console.log(object);
        
        object.traverse(function (child) 
        {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.map = texture;
                child.material.normalMap = normalMap;
                child.material.specularMap = specularMap;
            }
        });

        object.scale.set(3, 3, 3);
        object.position.z = -3;
        object.position.x = -1.5;
        object.rotation.y = -3;
        object.name = "objObject";
        objectList.push(object);
        scene.add(object);

    }
    catch (err) 
    {
        onError(err);
    }
}

main();