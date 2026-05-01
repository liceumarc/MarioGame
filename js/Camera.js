import { MARIO_SCREEN_ANCHOR_X, LOGICAL_WIDTH, LOGICAL_HEIGHT } from './constants.js';

export class Camera {
    constructor(mapWidthPixels, mapHeightPixels) {
        this.x = 0;
        this.y = 0;
        this.mapWidthPixels = mapWidthPixels;
        this.mapHeightPixels = mapHeightPixels;
    }

    // Seguimiento normal — solo eje X, Y permanece fija
    followPlayer(player) {
        const targetX = player.x - MARIO_SCREEN_ANCHOR_X;
        this.x = Math.max(0, targetX);
        this.x = Math.min(this.x, this.mapWidthPixels - LOGICAL_WIDTH);
    }

    // Arreglado problema de la camara en las tuberías
    snapToPlayer(player) {
        this.followPlayer(player);

        let targetY = (player.y - LOGICAL_HEIGHT / 2) - 32;
        let y = targetY;

        if (targetY <= 102) {
            targetY = targetY + 128;
        }
        if (targetY === 118) {
            targetY = targetY - 128;
        }

        this.y = targetY;
    }
}
