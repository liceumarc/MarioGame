import { GOOMBA_WIDTH, GOOMBA_HEIGHT, GOOMBA_SPEED, GOOMBA_SPRITE_W, GOOMBA_SPRITE_H, ENEMY_SPRITE_MAP, GRAVITY, TILE_SIZE } from '../constants.js';

export class Goomba {
    constructor(x, y, map) {
        this.map      = map;
        this.x        = x;
        this.y        = y;
        this.width    = GOOMBA_WIDTH;
        this.height   = GOOMBA_HEIGHT;
        this.vx       = 0;
        this.vy       = 0;
        this.grounded = false;
        this.alive    = true;
        this.stomped  = false;
        this.stompTimer = 0;
    }

    update(player) {
        if (!this.alive) return;

        if (this.stomped) {
            this.stompTimer--;
            if (this.stompTimer <= 0) this.alive = false;
            return;
        }

        this.vx  = player.x < this.x ? -GOOMBA_SPEED : GOOMBA_SPEED;
        this.vy += GRAVITY;

        this.x += this.vx;
        this.resolveHorizontalCollisions();

        this.y += this.vy;
        this.grounded = false;
        this.resolveVerticalCollisions();
    }

    resolveHorizontalCollisions() {
        const right = this.x + this.width;
        const touchesWallRight = this.map.isSolid(right, this.y) || this.map.isSolid(right, this.y + this.height - 1);
        const touchesWallLeft  = this.map.isSolid(this.x, this.y) || this.map.isSolid(this.x, this.y + this.height - 1);

        if (this.vx > 0 && touchesWallRight) {
            this.x  = Math.floor(right / TILE_SIZE) * TILE_SIZE - this.width - 0.01;
            this.vx = 0;
        }
        if (this.vx < 0 && touchesWallLeft) {
            this.x  = (Math.floor(this.x / TILE_SIZE) + 1) * TILE_SIZE;
            this.vx = 0;
        }
    }

    resolveVerticalCollisions() {
        const bottom = this.y + this.height;
        const touchesFloor   = this.map.isSolid(this.x, bottom) || this.map.isSolid(this.x + this.width - 0.01, bottom);
        const touchesCeiling = this.map.isSolid(this.x, this.y)  || this.map.isSolid(this.x + this.width - 0.01, this.y);

        if (this.vy > 0 && touchesFloor) {
            this.y        = Math.floor(bottom / TILE_SIZE) * TILE_SIZE - this.height;
            this.vy       = 0;
            this.grounded = true;
        }
        if (this.vy < 0 && touchesCeiling) {
            this.y  = (Math.floor(this.y / TILE_SIZE) + 1) * TILE_SIZE;
            this.vy = 0;
        }
    }

    onStomped() {
        this.stomped    = true;
        this.stompTimer = 30;
        this.vx         = 0;
        this.vy         = 0;
    }

    draw(ctx, enemiesImg) {
        if (!this.alive) return;
        ctx.drawImage(
            enemiesImg,
            ENEMY_SPRITE_MAP.goomba.sx, ENEMY_SPRITE_MAP.goomba.sy,
            GOOMBA_SPRITE_W, GOOMBA_SPRITE_H,
            Math.round(this.x), Math.round(this.y),
            GOOMBA_WIDTH, GOOMBA_HEIGHT
        );
    }
}