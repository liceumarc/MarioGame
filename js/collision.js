export function resolvePlayerEnemyCollision(player, goomba) {
    if (!goomba.alive || goomba.stomped) return null;

    if (!rectsOverlap(player, goomba)) return null;

    const playerBottom = player.y + player.height;
    const goombaTop    = goomba.y;
    const isStomp      = player.vy > 0 && playerBottom - goombaTop < 6;

    return isStomp ? 'stomp' : 'hit';
}

export function rectsOverlap(a, b) {
    return a.x < b.x + b.width  &&
           a.x + a.width  > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

export function isPlayerInZone(player, map, layer) {
    const left = player.x;
    const right = player.x + player.width - 1;
    const top = player.y;
    const bottom = player.y + player.height - 1;

    return map.isLayerTileAt(layer, left, top) ||
        map.isLayerTileAt(layer, right, top) ||
        map.isLayerTileAt(layer, left, bottom) ||
        map.isLayerTileAt(layer, right, bottom);
}
