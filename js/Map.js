export class GameMap {
    constructor(json) {
        this.width = json.width;
        this.height = json.height;
        this.tileSize = json.tilewidth;

        this.collisionLayer = this.findLayerByName(json, 'bloquesNoAtravesables');
        this.deathZoneLayer = this.findLayerByName(json, 'zona muerte');
        this.levelCompleteLayer = this.findLayerByName(json, 'superacionNivel');
        this.teleportOriginLayer = this.findLayerByName(json, 'tpOrigen');
        this.teleportExitLayer = this.findLayerByName(json, 'tpSalida');
    }

    findLayerByName(json, name) {
        const layer = json.layers.find(l => l.name === name);
        return layer;
    }

    pixelToTile(pixelX, pixelY) {
        return {
            col: Math.floor(pixelX / this.tileSize),
            row: Math.floor(pixelY / this.tileSize)
        };
    }

    isOutOfBounds(col, row) {
        return col < 0 || col >= this.width || row < 0 || row >= this.height;
    }

    tileIdAt(layer, col, row) {
        if (this.isOutOfBounds(col, row)) return 0;
        return layer.data[row * this.width + col];
    }

    isSolid(pixelX, pixelY) {
        const { col, row } = this.pixelToTile(pixelX, pixelY);
        return this.tileIdAt(this.collisionLayer, col, row) !== 0;
    }

    isLayerTileAt(layer, pixelX, pixelY) {
        const { col, row } = this.pixelToTile(pixelX, pixelY);
        return this.tileIdAt(layer, col, row) !== 0;
    }

    widthInPixels() {
        return this.width * this.tileSize;
    }

    heightInPixels() {
        return this.height * this.tileSize;
    }
}
