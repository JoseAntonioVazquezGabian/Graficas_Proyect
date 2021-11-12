import * as THREE from "./libs/three.js/r131/three.module.js"
import { OrbitControls } from './libs/three.js/r131/controls/OrbitControls.js';
import * as dat from "./libs/dat.gui.module.js"
import { OBJLoader } from './libs/three.js/r131/loaders/OBJLoader.js';
import { GLTFLoader } from './libs/three.js/r131/loaders/GLTFLoader.js';
//import * as csg from './libs/csg.js';

let renderer = null, scene = null, camera = null,  sphere = null,  sphereGroup = null, orbitControls = null;

let modelUrls = ["./resources/models/figure/scene.gltf", "./resources/models/figurhead/scene.gltf", "./resources/models/LPSP_PersonalShip.gltf", "./resources/models/LPSP_QuadFighter.gltf"];
let objects = [];
const duration = 5000; // ms
let currentTime = Date.now();

function main() 
{
    const canvas = document.getElementById("webglcanvas");
    createScene(canvas);
    update();
    orbitControls.update();
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
    // scene.background = textureLoader.load("./resources/textures/checkeredTexture.jpeg")

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.z = 10;
    scene.add(camera);

    orbitControls = new OrbitControls(camera, renderer.domElement);
    

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
    const ambientLight = new THREE.AmbientLight(0xffccaa, 1);
    scene.add(ambientLight);

    const textureUrl = "./resources/textures/checkeredTexture.jpeg";
    const texture = new THREE.TextureLoader().load(textureUrl);
    const material = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide});

    var planeGeo = new THREE.PlaneGeometry(100,100);
    var planeMesh = new THREE.Mesh(planeGeo, material);
    scene.add(planeMesh);

    var sphereGroup = new THREE.Object3D();
    // Move the sphere group up and back from the cube
    sphereGroup.position.set(1, 0, -0.5);

    // Create the sphere geometry
    var geometry = new THREE.SphereGeometry(1, 20, 20);

    // var spherePruebaGeo = csg.sphere();

    // var spherePruebaMesh = new THREE.Mesh(spherePruebaGeo, material);

    // sphereGroup.add(spherePruebaMesh);
    
    // And put the geometry and material together into a mesh
    sphere = new THREE.Mesh(geometry, material);

    // Add the sphere mesh to our group
    //sphereGroup.add( sphere );

    
    // Now add the group to our scene
    scene.add( sphereGroup );

    // add mouse handling so we can rotate the scene

    loadGLTF();

    //Plataforma y escenario

    crearEscenario(texture);

  
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

//Plataforma o espacio de pelea

function crearEscenario(texture){
    let escenarioGeo = new THREE.SphereGeometry(30, 32, 16, 0, Math.PI * 2, 0, 0.5);
    let escenario = new THREE.Mesh(escenarioGeo, new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide}))
    scene.add(escenario);
    return escenario;


}

async function loadGLTF()
{
    const gltfLoader = new GLTFLoader();

    const modelsPromises = modelUrls.map(url =>{
        return gltfLoader.loadAsync(url);
    });

    try
    {
        const results = await Promise.all(modelsPromises);

        results.forEach( (result, index) =>
        {
            console.log(result);

            const object = result.scene.children[0];

            object.scale.set( 0.05, 0.05, 0.05 );
            object.position.x = index > 0 ?  - Math.random() * 16: 0;
            object.position.y = index == 0 ?  - 4 :  8;
            object.position.z = -50 - Math.random() * 50;

            object.castShadow = true;
            object. receiveShadow = true;

            // object.mixer = new THREE.AnimationMixer( scene );
            // object.action = object.mixer.clipAction( result.animations[0], object).setDuration( 1.0 );

            // object.action.play();
            
            objects.push(object);           

            scene.add(object);
        });        
    }
    catch(err)
    {
        console.error(err);
    }

    
}

main();