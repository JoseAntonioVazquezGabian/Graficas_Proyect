import * as THREE from "../libs/three.module.js"
import { GLTFLoader } from '../libs/GLTFLoader.js';


let x, y, z, scene;
let geometry, material, mesh, escenarioPrefab;
let jugador;

export default class escenario
{
    constructor(x,y,z,scene,jugador)
    {
        this.jugador = jugador;
        this.x = x;
        this.y = y;
        this.z = z;
        this.scene = scene;
        this.escenarioPrefab = new THREE.Group();
        geometry = new THREE.BoxGeometry(this.jugador.getTamano(),0.5,this.jugador.getTamano());
        material = new THREE.MeshLambertMaterial({ color: 0x111111});
        mesh = new THREE.Mesh(geometry,material);
        mesh.position.set(this.x,this.y -0.25,this.z);
        this.escenarioPrefab.add(mesh);
        
        // paredes
        geometry = new THREE.BoxGeometry(this.jugador.getTamano(),40,0);
        material = new THREE.MeshLambertMaterial({ color: 0x111111});
        mesh = new THREE.Mesh(geometry,material);
        mesh.position.set(0,20,this.jugador.getTamano()/2);
        this.escenarioPrefab.add(mesh);
        
        geometry = new THREE.BoxGeometry(this.jugador.getTamano(),40,0);
        material = new THREE.MeshLambertMaterial({ color: 0x111111});
        mesh = new THREE.Mesh(geometry,material);
        mesh.position.set(0,20,-this.jugador.getTamano()/2);
        this.escenarioPrefab.add(mesh);

        geometry = new THREE.BoxGeometry(0,40,this.jugador.getTamano());
        material = new THREE.MeshLambertMaterial({ color: 0x111111});
        mesh = new THREE.Mesh(geometry,material);
        mesh.position.set(-this.jugador.getTamano()/2,20,0);
        this.escenarioPrefab.add(mesh);

        geometry = new THREE.BoxGeometry(0,40,this.jugador.getTamano());
        material = new THREE.MeshLambertMaterial({ color: 0x111111});
        mesh = new THREE.Mesh(geometry,material);
        mesh.position.set(this.jugador.getTamano()/2,20,0);
        this.escenarioPrefab.add(mesh);

        scene.add(this.escenarioPrefab);
    }
    //falta cambiar el look, añadir arboles, cambiar el color de lo gris del suelo (de preferencia pasto) powerups y jugadores
}