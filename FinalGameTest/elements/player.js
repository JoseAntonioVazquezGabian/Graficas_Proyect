import * as THREE from "../libs/three.module.js";
import { GLTFLoader } from '../libs/GLTFLoader.js';

let x, y, z, scene;
let geometry, material, mesh, tamano, playerPrefab;
let movimientox, movimientoy, movimientoz, velocidad, vida, arrVida, daño;
let meshR, meshH;
// power ups
let invertirContoles, tiempoInvMov, tiempoInvCont, tiempoAgrTam, tiempoRedTam;

export default class jugador
{
    constructor(scene, url, tamano)
    {
        this.tamano = tamano;
        this.x = 0;
        this.y = 2;
        this.z = 0;
        this.scene = scene;
        this.movimientox = 0;
        this.movimientoy = 0;
        this.movimientoz = 0;
        this.velocidad = 1;
        this.meshR = 0.4;
        this.meshH = 1.5;
        this.spownrate = 0;
        this.daño = 1;
        this.arrVida = []

        this.invertirContoles = 1;
        this.tiempoInvMov = 0;
        this.tiempoInvCont = 0;
        this.tiempoAgrTam = 0;
        this.tiempoRedTam = 0;

        this.playerPrefab = new THREE.Group();
        this.cargarModelo(this.playerPrefab, url);
        const geometry = new THREE.CylinderGeometry( this.meshR, this.meshR, this.meshH, 32);
        const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        const cylinder = new THREE.Mesh( geometry, material );
        cylinder.position.y = 0.75;
        //this.playerPrefab.add(cylinder) //descomentar para ver la colcion
        this.playerPrefab.position.set(this.x,this.y,this.z);
        scene.add(this.playerPrefab);
    }

    changeVida(cant)
    {
        this.vida = cant;
        this.arrVida.forEach(mesh => mesh.parent.remove( mesh ));
        this.arrVida = [];
        for(let i = 0; i < cant; i ++)
        {
            let geometry = new THREE.BoxGeometry(0.25,0.25,0.25);
            let material = new THREE.MeshLambertMaterial({ color: 0xcc0000});
            let mesh = new THREE.Mesh(geometry,material);
            this.playerPrefab.add(mesh);
            mesh.position.y = 1.75;
            mesh.position.z = - ((this.vida * 0.25)/2) + 0.125  + (i * 0.25);
            this.arrVida.push(mesh);
        }
    }

    chocar(x,z)
    {
        // Falta empujar hacia atras el jugador
    }

    muerto()
    {
        return this.vida <= 0;
    }

    invCont()
    {
        this.tiempoInvCont += 60;
        this.invertirContoles = -1;
    }
    invMov()
    {
        this.tiempoInvMov += 3;
        this.invertirContoles = 0;
    }

    agrTam()
    {
        this.daño = 2;
        this.velocidad = 0.5;
        this.meshR = this.meshR*2;
        this.tiempoAgrTam = 60;
        // falta Modificar el sprite
    }

    redTam()
    {
        this.daño = 0;
        this.velocidad = 2;
        this.meshR = this.meshR/2;
        this.tiempoRedTam = 60;
        // falta Modificar el sprite
    }

    cenPlay()
    {
        this.x = 0;
        this.z = 0;
    }

    addLive()
    {
        this.changeVida(this.vida + 1);
    }

    removeLive()
    {
        this.changeVida(this.vida - 1);
    }

    moverx(x)
    {
        this.movimientox = x * this.velocidad;
    }

    movery(y)
    {
        this.movimientoy = y;
    }

    moverz(z)
    {
        this.movimientoz = z * this.velocidad;
    }

    getMovz()
    {
        return this.movimientoz;
    }

    getTamano()
    {
        return this.tamano;
    }

    cgetClision()
    {
        return this.meshR;
    }

    getPosX()
    {
        return this.x;
    }

    getPosY()
    {
        return this.y;
    }

    getPosZ()
    {
        return this.z;
    }

    restart()
    {
        this.x = 0;
        this.y = 2;
        this.z = 0;
        this.movimientox = 0;
        this.movimientoy = 0;
        this.movimientoz = 0;
        this.playerPrefab.position.set(this.x,this.y,this.z);
        this.meshR = 0.4;
        this.meshH = 1.5;
        this.spownrate = 0;
        this.daño = 1;
        this.invertirContoles = 1;
        this.tiempoInvMov = 0;
        this.tiempoInvCont = 0;
        this.changeVida(0);
    }

    powerUps()
    {
        // Invertir Controles
        if(this.tiempoInvCont < 0)
        {
            this.tiempoInvCont = 0;
            this.invertirContoles = 1;

        }
        if(this.tiempoInvCont > 0)
        {
            this.tiempoInvCont -= 0.1;
            this.movimientox = this.movimientox * this.invertirContoles;
            this.movimientoz = this.movimientoz * this.invertirContoles;
        }
        // Invalidar Movimiento
        if(this.tiempoInvMov < 0)
        {
            this.tiempoInvCont = 0;
            this.invertirContoles = 1;

        }
        if(this.tiempoInvMov > 0)
        {
            this.tiempoInvMov -= 0.1;
            this.movimientox = this.movimientox * this.invertirContoles;
            this.movimientoz = this.movimientoz * this.invertirContoles;
        }
        // Agrandar tamaño
        if(this.tiempoAgrTam < 0)
        {
            this.tiempoAgrTam = 0;
            // falta Restablecer Sptrite
        }
        if(this.tiempoAgrTam > 0)
        {
            this.tiempoAgrTam -= 0.1;
        }
        // Reducir tamaño
        if(this.tiempoRedTam < 0)
        {
            this.tiempoRedTam = 0;
            // falta Restablecer Sptrite
        }
        if(this.tiempoRedTam > 0)
        {
            this.tiempoRedTam -= 0.1;
        }
        
    }

    update()
    {
        this.powerUps();

        // Rotate player
        if(this.movimientox > 0)
        {
            if(this.movimientoz > 0)
            {
                this.playerPrefab.rotation.y = (Math.PI * 3)/4;
            }
            else if(this.movimientoz < 0)
            {
                this.playerPrefab.rotation.y =  Math.PI * 5 / 4;
            }
            else
            {
                this.playerPrefab.rotation.y = Math.PI;
            }
        }
        else if(this.movimientox < 0)
        {
            if(this.movimientoz > 0)
            {
                this.playerPrefab.rotation.y = Math.PI/4;
            }
            else if(this.movimientoz < 0)
            {
                this.playerPrefab.rotation.y = Math.PI * 7 / 4;
            }
            else
            {
                this.playerPrefab.rotation.y = 0;
            }
        }
        else if(this.movimientoz > 0)
        {
            this.playerPrefab.rotation.y = Math.PI/2;
        }
        else if(this.movimientoz < 0)
        {
            this.playerPrefab.rotation.y = (Math.PI*3)/2;
        }

        // Gravedad
        if(this.y > 0)
        {
            this.movimientoy = -0.1;
        }
        if(this.y + this.movimientoy < 0)
        {
            this.movimientoy = 0;
            this.y = 0;
        }

        // Limite del mapa
        if(this.x + this.movimientox + this.meshR> this.tamano/2)
        {
            this.x = (this.tamano/2) - this.meshR;
            this.movimientox = 0;
        }
        if(this.x + this.movimientox - this.meshR < -this.tamano/2)
        {
            this.x = -(this.tamano/2) + this.meshR;
            this.movimientox = 0;
        }
        if(this.z + this.movimientoz + this.meshR > this.tamano/2)
        {
            this.z = (this.tamano/2) - this.meshR;
            this.movimientoz = 0;
        }
        if(this.z + this.movimientoz - this.meshR < -this.tamano/2)
        {
            this.z = -(this.tamano/2) + this.meshR;
            this.movimientoz = 0;
        }

        // Mover el jugador
        this.x += this.movimientox;
        this.y += this.movimientoy;
        this.z += this.movimientoz;
        this.playerPrefab.position.set(this.x, this.y, this.z);
        
    }

    reCargarModelo(url)
    {
        this.cargarModelo(this.playerPrefab, url);
    }

    cargarModelo(game, url)
    {
        var loader = new GLTFLoader();
        loader.load( url, function ( gltf ) {

            let model = gltf.scene;
            model.scale.set(0.02,0.02,0.02);
            model.rotation.y = -1.5;
            game.add( model );

        }, undefined, function ( e ) {
            console.error( e );
        } );
    }
}