import { LOGICAL_WIDTH, LOGICAL_HEIGHT } from './constants.js';

export function drawTitleScreen(ctx, titleImg) {
    ctx.drawImage(titleImg, 0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
    drawBlinkingPressAnyKey(ctx);
}

export function drawGameOverScreen(ctx) {
    drawSemiTransparentOverlay(ctx);
    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = 'white';
    ctx.fillText('GAME OVER', 66, 110);
    ctx.font = 'bold 7px monospace';
    ctx.fillText('PRESS R TO RETRY', 68, 130);
}

export function drawWinScreen(ctx) {
    drawSemiTransparentOverlay(ctx);
    ctx.font = 'bold 14px monospace';
    ctx.fillStyle = '#FFD700';
    ctx.fillText('YOU WIN!', 80, 110);
    ctx.font = 'bold 7px monospace';
    ctx.fillStyle = 'white';
    ctx.fillText('PRESS R TO PLAY AGAIN', 48, 130);
}

function drawBlinkingPressAnyKey(ctx) {
    const isVisible = Math.floor(Date.now() / 500) % 2 === 0;
    if (!isVisible) return;
    ctx.font = 'bold 7px monospace';
    ctx.fillStyle = 'white';
    ctx.fillText('PRESS ANY KEY', 120, 182);
}

function drawSemiTransparentOverlay(ctx) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);
}
