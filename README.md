# Graficas_Proyect
## A01746585 Jose Antonio Vazquez Gabian
## A01745997 Luis Miguel Baqueiro Vallejo
## A01374561 Jose Francisco Murillo Lozano

# Proyecto:

Sumo ball en 3D: En esta idea queremos similar lo que es el juego de sumo ball pero en un contexto 3D con ciertas adquisiciones nuevas como lo son powerup asi como vidas por jugador.

# Escenario:

Tendrá un escenario cóncavo el cual se reducirá dependiendo del tiempo que vaya transcurriendo en la partida. Tendrá una textura definida que permita distinguirse de los personajes.
*Dependiendo de las herramientas que nos provea la librería que utilicemos, estamos contemplando hacer un segundo mapa/escenario. En el cual no te puedas "caer" y tu vida sea representada por un float el cual se reduce cuando te pegan dependiendo de la fuerza con la que te peguen.

# Interacción:

- La interacción que podrá tener el usuario será a través de "WASD" o las flechas que le permitirán mover a su personaje en la dirección indicada.
- El usuario podrá seleccionar su bola (el color) así como el personaje (de diferentes modelos que tendremos disponibles) a usar dando personalización al jugador.
- Activar o desactivar el sonido.
- Poner pausa.

# Reglas del juego:

El juego consiste en ser el último jugador en la plataforma.
Ya sea sacándolos del doyo o reduciéndoles la vida a 0.
Te mueves con "WASD" o las flechas del teclado.
Pierdes cuando tu(s) vida(s) se acaba(n).

## Powerups:
- Agrandamiento: Escala el personaje. Aumenta el daño, aumenta el tamaño, alenta y fuerza de empuje que éste tiene. (Duración: )
- Reducción de Tamaño: Escala el personaje. Reduce el daño, reduce el tamaño, se vuelve más ágil y por ende reduce la masa del objeto. (Duración: )
- Invertir controles: Bastante straight-forward. (Duración: )
- *Mover cámara: Cambiará la perspectiva del usuario. Sin modificar la dirección original de los controles. (Duración: )
- Invalidar movimiento (dormir): Invalida todo movimiento mientras esté activo. Solo puede aparecer durante un 1v1. (Duración: )

# Flujo del juego:

**Checar flujoDeJuego.jpg


*TBD