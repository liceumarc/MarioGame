import { TELEPORT_CONNECTIONS, TELEPORT_COOLDOWN_FRAMES, TILE_SIZE, MARIO_WIDTH, MARIO_HEIGHT } from './constants.js';

export class TeleportSystem {
    constructor(map) {
        this.map = map;
        this.cooldown = 0;
        this.connections = this.buildConnections();
    }

    buildConnections() {
        const originData = this.map.teleportOriginLayer.data;
        const exitData = this.map.teleportExitLayer.data;

        return TELEPORT_CONNECTIONS.map((conn, index) => {
            const originPositions = this.findTilePositionsByIds(originData, conn.originTiles);
            const exitPositions = this.findTilePositionsByIds(exitData, conn.exitTiles);

            const originRects = originPositions.map(pos => ({
                x: pos.col * TILE_SIZE,
                y: pos.row * TILE_SIZE,
                w: TILE_SIZE,
                h: TILE_SIZE
            }));

            const exitPixel = this.computeExitFromPositions(exitPositions);

            return { originRects, exitPixel };
        });
    }

    findTilePositionsByIds(layerData, tileIds) {
        const idSet = new Set(tileIds);
        const positions = [];
        for (let i = 0; i < layerData.length; i++) {
            if (idSet.has(layerData[i])) {
                positions.push({
                    col: i % this.map.width,
                    row: Math.floor(i / this.map.width)
                });
            }
        }
        return positions;
    }

    computeExitFromPositions(positions) {
        const pixelCoords = positions.map(p => ({ x: p.col * TILE_SIZE, y: p.row * TILE_SIZE }));
        const minX = Math.min(...pixelCoords.map(p => p.x));
        const maxX = Math.max(...pixelCoords.map(p => p.x + TILE_SIZE));
        const minY = Math.min(...pixelCoords.map(p => p.y));

        return {
            x: (minX + maxX) / 2 - MARIO_WIDTH / 2,
            y: minY - MARIO_HEIGHT
        };
    }

    update(player, camera, input) {
        if (this.cooldown > 0) {
            this.cooldown--;
            return;
        }

        if (!player.grounded || !input.isDown('KeyT')) return;

        const activeConnection = this.findActiveConnection(player);
        if (!activeConnection) return;

        player.x = activeConnection.exitPixel.x;
        player.y = activeConnection.exitPixel.y;
        player.vy = 0;
        player.grounded = false;
        this.cooldown = TELEPORT_COOLDOWN_FRAMES;

        camera.snapToPlayer(player);
    }

    findActiveConnection(player) {
        const left = player.x;
        const right = player.x + player.width;
        const top = player.y;
        const bottom = player.y + player.height;

        for (const connection of this.connections) {
            const isOverlapping = connection.originRects.some(rect =>
                right > rect.x && left < rect.x + rect.w &&
                bottom > rect.y && top < rect.y + rect.h
            );
            if (isOverlapping) return connection;
        }
        return null;
    }
}
