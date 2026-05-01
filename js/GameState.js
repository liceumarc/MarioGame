import { INITIAL_TIME } from './constants.js';

export function createGameState() {
    return {
        screen: 'TITLE',   
        coins: 0,
        score: 0,
        timeRemaining: INITIAL_TIME,
        timerTick: 0          
    };
}
