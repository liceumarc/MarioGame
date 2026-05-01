# MarioProject — Documentación técnica

Un juego de plataformas estilo Mario Bros escrito en JavaScript puro con Canvas 2D. Sin frameworks, sin bundlers, sin dependencias externas. Solo ES Modules nativos y un JSON de Tiled para los mapas.

---

## Cómo arranca el juego

El punto de entrada es `main.html`, que carga `js/main.js` como módulo. Antes de que empiece nada, `AssetLoader` carga en paralelo el mapa JSON y todas las imágenes. Cuando todo está listo, se llama a `initGame()` y arranca el bucle con `requestAnimationFrame`.

Cada fotograma hace dos cosas, en este orden:

1. **update** — lee el teclado, mueve a Mario, actualiza enemigos, mueve la cámara, comprueba colisiones con zonas especiales.
2. **draw** — escala el canvas, aplica el desplazamiento de la cámara y dibuja todo: fondo, enemigos, Mario, HUD y pantallas de estado.

---

## Estructura de archivos

```
main.html
js/
├── constants.js        — todas las constantes y configuración del juego
├── AssetLoader.js      — carga imágenes y el JSON del mapa
├── Input.js            — estado del teclado
├── GameState.js        — estado inicial del juego (pantalla, puntos, tiempo)
├── Map.js              — interpreta el JSON de Tiled y resuelve colisiones
├── Camera.js           — seguimiento de Mario y límites del mapa
├── SpriteRenderer.js   — funciones para dibujar los sprites de Mario
├── Player.js           — movimiento, física y animación de Mario
├── TeleportSystem.js   — lógica de las tuberías
├── collision.js        — funciones puras de detección de colisiones
├── enemies/
│   └── Goomba.js       — física, IA y comportamiento del Goomba
├── hud.js              — dibuja puntuación, monedas y tiempo
├── ScreenManager.js    — pantallas de título, game over y victoria
└── main.js             — punto de entrada, conecta todo y gestiona el bucle
```

---

## Los módulos por dentro

### `constants.js`
Aquí vive toda la configuración del juego: tamaños, velocidades, fuerzas, posiciones de spawn, coordenadas de sprites y las conexiones de las tuberías. Si necesitas ajustar cualquier valor del juego, este es el primer sitio donde mirar. No importa nada.

### `AssetLoader.js`
Gestiona la carga de recursos. Sus métodos `loadImage` y `loadJSON` devuelven promesas, y `loadAll` las lanza en paralelo. Una vez resueltas, las imágenes están en `assets.images` y el mapa en `assets.data.map`.

### `Input.js`
Escucha los eventos `keydown` y `keyup` del navegador y los guarda en un objeto. El resto del juego consulta `input.isDown('ArrowRight')` o similar sin saber nada de eventos del DOM.

### `GameState.js`
Una simple función que devuelve el estado inicial: pantalla actual (`TITLE`), puntuación, monedas y tiempo restante. No tiene lógica propia, solo datos.

### `Map.js` — exporta `GameMap`
Es el intérprete del JSON de Tiled. Al construirse, localiza cada capa por nombre y la guarda como propiedad. Luego expone métodos para que el resto del juego pueda preguntar cosas como "¿hay un bloque sólido en estos píxeles?" sin tener que saber nada del formato del JSON.

> ⚠️ La clase se llama `GameMap` en lugar de `Map` para no colisionar con el `Map` nativo de JavaScript.

### `Camera.js`
Sigue a Mario horizontalmente manteniendo un margen izquierdo fijo (`MARIO_SCREEN_ANCHOR_X`). Tiene dos modos: `followPlayer` para el seguimiento normal y `snapToPlayer` que además reposiciona el eje Y, usado exclusivamente tras los teletransportes.

### `SpriteRenderer.js`
Dos funciones auxiliares que `Player` usa para calcular qué parte del spritesheet dibujar según el estado de Mario (idle, caminando, saltando, muerto) y en qué dirección mira.

### `Player.js`
El módulo más grande. Gestiona la lectura del input, aplica gravedad, resuelve colisiones contra los tiles sólidos del mapa y actualiza la animación de caminata. La física es sencilla: mover primero, corregir después si hay colisión.

### `TeleportSystem.js`
Al iniciarse, parsea las capas `tpOrigen` y `tpSalida` del mapa y construye las conexiones usando `TELEPORT_CONNECTIONS` de las constantes. En cada fotograma comprueba si Mario está sobre una tubería y si se pulsa la tecla `T`; si se cumple, reposiciona a Mario en la salida y avisa a la cámara para que haga snap.

### `collision.js`
Tres funciones puras que no pertenecen a ninguna clase concreta:
- `rectsOverlap` — detecta si dos rectángulos se solapan.
- `resolvePlayerEnemyCollision` — decide si el contacto Mario-Goomba es un pisotón o un golpe lateral.
- `isPlayerInZone` — comprueba si Mario está sobre un tile de una capa concreta (muerte, meta, etc).

### `enemies/Goomba.js`
El único enemigo implementado. Tiene física propia (gravedad y colisiones contra bloques), una IA simple que lo mueve horizontalmente hacia Mario, y una pequeña animación de aplastado antes de desaparecer.

### `hud.js`
Dibuja la barra superior con el nombre del jugador, la puntuación, el contador de monedas y el tiempo. Todo en coordenadas de pantalla lógica, no del mundo.

### `ScreenManager.js`
Las pantallas de título, game over y victoria. El título tiene un texto parpadeante. Game over y victoria muestran un overlay semitransparente con instrucciones para reiniciar.

### `main.js`
Orquesta todo. No tiene lógica de juego propia: conecta los módulos, gestiona el ciclo de vida (`initGame`, `resetGame`) y delega cada fotograma a `update` y `draw`.

---

## Capas del mapa

El mapa `json/mapWorld1-1.json` está generado con Tiled y tiene estas capas:

| Capa | Función |
|---|---|
| `background` | Tiles de fondo, solo visual |
| `bloquesNoAtravesables` | Tiles sólidos — paredes y suelo |
| `monedas` | Monedas del nivel — solo visual de momento |
| `tpOrigen` | Tiles de entrada de las tuberías |
| `tpSalida` | Tiles de salida de las tuberías |
| `zona muerte` | Matar a Mario al entrar |
| `superacionNivel` | Completar el nivel al entrar |

---

## Constantes importantes

| Constante | Valor | Para qué sirve |
|---|---|---|
| `SCALE` | 2.5 | El juego corre a 256×240 pero el canvas es más grande |
| `TILE_SIZE` | 16 | Tamaño de cada tile en píxeles |
| `GRAVITY` | 0.13 | Cuánto acelera la caída cada frame |
| `MARIO_SPEED` | 1.5 | Velocidad horizontal de Mario |
| `JUMP_FORCE` | -4.2 | Impulso inicial del salto (negativo = hacia arriba) |
| `INITIAL_TIME` | 400 | Tiempo con el que empieza el nivel |
| `MARIO_SCREEN_ANCHOR_X` | 80 | A cuántos píxeles del borde izquierdo aparece Mario |
| `TELEPORT_COOLDOWN_FRAMES` | 60 | Frames de espera tras usar una tubería |
| `TELEPORT_CONNECTIONS` | array | Las dos conexiones de tuberías con sus tiles de entrada y salida |
| `GOOMBA_SPAWN_POSITIONS` | `[{x:682, y:190}]` | Dónde aparece cada Goomba al empezar |

---

## Estado de implementación

| Funcionalidad | Estado | Notas |
|---|---|---|
| Movimiento de Mario | ⚠️ Parcial | Funciona pero faltaría añadir más imagenes para que el movimiento sea fluido |
| Salto | ✅ Completo | |
| Colisiones con bloques | ✅ Completo | |
| Temporizador de nivel | ✅ Completo | |
| Zona de muerte | ✅ Completo | |
| Fin de nivel | ✅ Completo | |
| Tuberías / Teletransporte | ⚠️ Parcial | Funciona, pero no hay animación de entrada ni sonido |
| HUD | ⚠️ Parcial | Se dibuja correctamente, pero el contador de monedas no se actualiza |
| Enemigo Goomba | ⚠️ Parcial | Movimiento, pisotón y muerte implementados; sin animación de caminar |
| Recolección de monedas | ❌ Sin implementar | La capa existe en el mapa pero no hay lógica de detección ni puntos |
| Sonido | ❌ Sin implementar | No hay ningún sistema de audio |

---

## Cómo añadir cosas nuevas

### Un Goomba en otra posición
Añadir una entrada a `GOOMBA_SPAWN_POSITIONS` en `constants.js`:
```js
{ x: 900, y: 190 }
```

### Una tubería nueva
Añadir una conexión a `TELEPORT_CONNECTIONS` en `constants.js` con los IDs de los tiles de origen y salida del JSON:
```js
{ originTiles: [1234, 1235], exitTiles: [5678, 5679] }
```

### Un nuevo tipo de enemigo
Crear `js/enemies/NombreEnemigo.js` siguiendo la misma estructura que `Goomba.js`. Luego importarlo en `main.js`, añadir sus posiciones de spawn en `constants.js` y llamar a su `update` y `draw` en el bucle principal.
