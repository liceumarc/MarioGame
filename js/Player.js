import { MARIO_WIDTH, MARIO_HEIGHT, MARIO_SPEED, JUMP_FORCE, GRAVITY, TILE_SIZE, WALK_ANIM_SPEED, WALK_ANIM_FRAMES } from './constants.js';
import { getSpriteCoords, drawMarioSprite } from './SpriteRenderer.js';

export class Player {
    constructor(map) {
        this.map = map;
        this.width = MARIO_WIDTH;
        this.height = MARIO_HEIGHT;
        this.x = 100;
        this.y = 180;
        this.vx = 0;
        this.vy = 0;
        this.grounded = false;
        this.facingRight = true;
        this.state = 'idle';
        this.animFrame = 0;
        this.animTimer = 0;
    }

    update(input) {
        this.readInput(input);
        this.applyGravity();
        this.moveHorizontally();
        this.moveVertically();
        this.updateAnimation();
        this.clampToMapLeft();
    }

    readInput(input) {
        if (input.isDown('ArrowRight')) {
            this.vx = MARIO_SPEED;
            this.facingRight = true;
            this.state = 'walk';
        } else if (input.isDown('ArrowLeft')) {
            this.vx = -MARIO_SPEED;
            this.facingRight = false;
            this.state = 'walk';
        } else {
            this.vx = 0;
            this.state = 'idle';
        }

        if (input.isDown('Space') && this.grounded) {
            this.vy = JUMP_FORCE;
            this.grounded = false;
        }
    }

    applyGravity() {
        this.vy += GRAVITY;
        if (!this.grounded) this.state = 'jump';
    }

    moveHorizontally() {
        this.x += this.vx;
        this.resolveHorizontalCollisions();
    }

    moveVertically() {
        this.y += this.vy;
        this.grounded = false;
        this.resolveVerticalCollisions();
    }

    resolveHorizontalCollisions() {
        if (this.vx > 0) this.resolveRightWallCollision();
        if (this.vx < 0) this.resolveLeftWallCollision();
    }

    resolveRightWallCollision() {
        const rightEdge = this.x + this.width;
        if (this.map.isSolid(rightEdge, this.y) ||
            this.map.isSolid(rightEdge, this.y + this.height - 1)) {
            this.x = Math.floor(rightEdge / TILE_SIZE) * TILE_SIZE - this.width - 0.01;
            this.vx = 0;
        }
    }

    resolveLeftWallCollision() {
        if (this.map.isSolid(this.x, this.y) ||
            this.map.isSolid(this.x, this.y + this.height - 1)) {
            this.x = (Math.floor(this.x / TILE_SIZE) + 1) * TILE_SIZE;
            this.vx = 0;
        }
    }

    resolveVerticalCollisions() {
        if (this.vy > 0) this.resolveLandingCollision();
        if (this.vy < 0) this.resolveHeadBumpCollision();
    }

    resolveLandingCollision() {
        const bottomEdge = this.y + this.height;
        if (this.map.isSolid(this.x, bottomEdge) ||
            this.map.isSolid(this.x + this.width - 0.01, bottomEdge)) {
            this.y = Math.floor(bottomEdge / TILE_SIZE) * TILE_SIZE - this.height;
            this.vy = 0;
            this.grounded = true;
        }
    }

    resolveHeadBumpCollision() {
        if (this.map.isSolid(this.x, this.y) ||
            this.map.isSolid(this.x + this.width - 0.01, this.y)) {
            this.y = (Math.floor(this.y / TILE_SIZE) + 1) * TILE_SIZE;
            this.vy = 0;
        }
    }

    updateAnimation() {
        if (this.state !== 'walk') {
            this.animFrame = 0;
            this.animTimer = 0;
            return;
        }
        this.animTimer++;
        if (this.animTimer > WALK_ANIM_SPEED) {
            this.animFrame = (this.animFrame + 1) % WALK_ANIM_FRAMES;
            this.animTimer = 0;
        }
    }

    clampToMapLeft() {
        if (this.x < 0) this.x = 0;
    }

    draw(ctx, marioImg) {
        const coords = getSpriteCoords(this.state, this.facingRight, this.animFrame);
        drawMarioSprite(ctx, marioImg, coords, this.x, this.y);
    }
}
