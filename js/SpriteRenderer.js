import { SPRITE_MAP, MARIO_WIDTH, MARIO_HEIGHT } from './constants.js';

export function getSpriteCoords(state, facingRight, animFrame) {
    if (state === 'idle') return facingRight ? SPRITE_MAP.idle.right : SPRITE_MAP.idle.left;
    if (state === 'jump') return facingRight ? SPRITE_MAP.jump.right : SPRITE_MAP.jump.left;
    if (state === 'die') return SPRITE_MAP.die;
    if (state === 'walk') {
        return {
            sx: facingRight ? SPRITE_MAP.walk.right.sx : SPRITE_MAP.walk.left.sx,
            sy: SPRITE_MAP.walk.walkY[animFrame]
        };
    }
    return SPRITE_MAP.idle.right; 
}

export function drawMarioSprite(ctx, marioImg, coords, x, y) {
    ctx.drawImage(
        marioImg,
        coords.sx, coords.sy, MARIO_WIDTH, MARIO_HEIGHT,
        Math.round(x), Math.round(y), MARIO_WIDTH, MARIO_HEIGHT
    );
}
