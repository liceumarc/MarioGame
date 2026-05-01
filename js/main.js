import { CANVAS_WIDTH, CANVAS_HEIGHT, SCALE, LOGICAL_WIDTH, STOMP_BOUNCE_FORCE, GOOMBA_SPAWN_POSITIONS } from './constants.js';
import { AssetLoader } from './AssetLoader.js';
import { Input } from './Input.js';
import { createGameState } from './GameState.js';
import { GameMap } from './Map.js';
import { Camera } from './Camera.js';
import { Player } from './Player.js';
import { Goomba } from './enemies/Goomba.js';
import { TeleportSystem } from './TeleportSystem.js';
import { isPlayerInZone, resolvePlayerEnemyCollision } from './collision.js';
import { drawHUD } from './hud.js';
import { drawTitleScreen, drawGameOverScreen, drawWinScreen } from './ScreenManager.js';

// ─── SETUP ────────────────────────────────────────────────────────────────────
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;

const assets = new AssetLoader();
const input  = new Input();

let map, player, camera, teleportSystem, enemies, gameState;

assets.loadAll().then(() => {
    initGame();
    requestAnimationFrame(loop);
});

function initGame() {
    map = new GameMap(assets.data['map']);
    player = new Player(map);
    camera = new Camera(map.widthInPixels(), map.heightInPixels());
    teleportSystem = new TeleportSystem(map);
    enemies = spawnEnemies(map);
    gameState = createGameState();
}

function resetGame() {
    player = new Player(map);
    camera = new Camera(map.widthInPixels(), map.heightInPixels());
    teleportSystem = new TeleportSystem(map);
    enemies = spawnEnemies(map);
    gameState = createGameState();
    gameState.screen = 'PLAYING';
}

function update() {
    const handlers = {
        TITLE: updateTitleScreen,
        PLAYING: updatePlayingScreen,
        GAME_OVER: updateGameOverScreen,
        WIN: updateWinScreen
    };
    handlers[gameState.screen]?.();
}

function updateTitleScreen() {
    if (input.anyKeyPressed) gameState.screen = 'PLAYING';
}

function updatePlayingScreen() {
    player.update(input);
    teleportSystem.update(player, camera, input);
    enemies.forEach(e => e.update(player));
    camera.followPlayer(player);
    tickGameTimer();

    if (teleportSystem.cooldown > 0) return;

    // Colisiones Mario ↔ enemigos
    for (const goomba of enemies) {
        const result = resolvePlayerEnemyCollision(player, goomba);
        if (result === 'stomp') {
            goomba.onStomped();
            player.vy = STOMP_BOUNCE_FORCE;
        } else if (result === 'hit') {
            gameState.screen = 'GAME_OVER';
            return;
        }
    }

    if (gameState.timeRemaining <= 0)                              gameState.screen = 'GAME_OVER';
    if (isPlayerInZone(player, map, map.deathZoneLayer))           gameState.screen = 'GAME_OVER';
    if (isPlayerInZone(player, map, map.levelCompleteLayer))       gameState.screen = 'WIN';
}

function updateGameOverScreen() {
    if (input.isDown('KeyR')) resetGame();
}

function updateWinScreen() {
    if (input.isDown('KeyR')) resetGame();
}

function tickGameTimer() {
    gameState.timerTick++;
    if (gameState.timerTick >= 60) {
        gameState.timeRemaining--;
        gameState.timerTick = 0;
    }
}

function draw() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.save();
    ctx.scale(SCALE, SCALE);

    if (gameState.screen === 'TITLE') {
        drawTitleScreen(ctx, assets.images['title']);
        ctx.restore();
        return;
    }

    drawWorldWithCamera();
    drawUILayer();

    ctx.restore();
}

function drawWorldWithCamera() {
    ctx.save();
    ctx.translate(-Math.floor(camera.x), -Math.floor(camera.y));
    drawBackground(ctx);
    enemies.forEach(e => e.draw(ctx, assets.images['enemies']));
    player.draw(ctx, assets.images['mario']);
    ctx.restore();
}

function spawnEnemies(map) {
    return GOOMBA_SPAWN_POSITIONS.map(pos => new Goomba(pos.x, pos.y, map));
}

function drawUILayer() {
    if (gameState.screen === 'PLAYING') drawHUD(ctx, gameState);
    if (gameState.screen === 'GAME_OVER') drawGameOverScreen(ctx);
    if (gameState.screen === 'WIN') drawWinScreen(ctx);
}

function drawBackground(ctx) {
    const bg = assets.images['bg'];
    if (bg) ctx.drawImage(bg, 0, 0);
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}
