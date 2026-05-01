export const CANVAS_WIDTH = 640;
export const CANVAS_HEIGHT = 600;
export const SCALE = 2.5;
export const LOGICAL_WIDTH = 256;
export const LOGICAL_HEIGHT = 240;
export const TILE_SIZE = 16;
export const GRAVITY = 0.13;
export const MARIO_SPEED = 1.5;
export const JUMP_FORCE = -4.2;
export const MARIO_WIDTH = 18;
export const MARIO_HEIGHT = 18;
export const WALK_ANIM_SPEED = 30;   
export const WALK_ANIM_FRAMES = 3;   
export const INITIAL_TIME = 400;
export const POINTS_PER_COIN = 100;
export const MARIO_SCREEN_ANCHOR_X = 80;

export const TELEPORT_COOLDOWN_FRAMES = 60;

export const TELEPORT_CONNECTIONS = [
    { originTiles: [1746, 1747], exitTiles: [3637, 3638] },
    { originTiles: [5547, 5758], exitTiles: [2274, 2275] }
];

export const ASSETS = {
    jsonMap: 'json/mapWorld1-1.json',
    imgBg: 'img/bg-1-1.png',
    imgMario: 'img/mario.png',
    imgTitle: 'img/mario_title_screen.png',
    enemies: 'img/enemies.png'
};

// Coordenadas (sx, sy) de cada estado en el spritesheet mario.png
export const SPRITE_MAP = {
    idle: { right: { sx: 212, sy: 87 }, left: { sx: 175, sy: 87 } },
    walk: { right: { sx: 253 }, left: { sx: 134 }, walkY: [87, 128, 169] },
    jump: { right: { sx: 335, sy: 87 }, left: { sx: 54, sy: 87 } },
    die: { sx: 14, sy: 208 }
};

export const GOOMBA_WIDTH        = 16;
export const GOOMBA_HEIGHT       = 16;
export const GOOMBA_SPEED        = 0.6;
export const GOOMBA_SPRITE_W     = 16;
export const GOOMBA_SPRITE_H     = 16;
export const STOMP_BOUNCE_FORCE  = -3.5;

export const GOOMBA_SPAWN_POSITIONS = [
    { x: 682, y: 190 }
];

export const ENEMY_SPRITE_MAP = {
    goomba: { sx: 118, sy: 42 }
};
