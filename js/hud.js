import { LOGICAL_WIDTH, LOGICAL_HEIGHT } from './constants.js';

export function drawHUD(ctx, gameState) {
    ctx.save();
    setupHUDFont(ctx);
    drawPlayerLabel(ctx);
    drawScore(ctx, gameState.score);
    drawCoinCount(ctx, gameState.coins);
    drawTimer(ctx, gameState.timeRemaining);
    ctx.restore();
}

function setupHUDFont(ctx) {
    ctx.font = 'bold 8px monospace';
    ctx.fillStyle = 'white';
    ctx.shadowColor = 'black';
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
}

function drawPlayerLabel(ctx) {
    ctx.fillText('MARIO', 10, 10);
}

function drawScore(ctx, score) {
    ctx.fillText(formatScore(score), 10, 19);
}

function drawCoinCount(ctx, coins) {
    ctx.fillText(`* ${formatTwoDigits(coins)}`, 90, 14);
}

function drawTimer(ctx, timeRemaining) {
    ctx.fillText('TIME', 200, 10);
    ctx.fillText(formatTimer(timeRemaining), 200, 19);
}

function formatScore(score) {
    return String(score).padStart(6, '0');
}

function formatTwoDigits(n) {
    return String(n).padStart(2, '0');
}

function formatTimer(time) {
    return String(Math.ceil(time)).padStart(3, '0');
}
