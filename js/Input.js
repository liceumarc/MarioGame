export class Input {
    constructor() {
        this.keys = {};
        this.anyKeyPressed = false;
        window.addEventListener('keydown', e => { this.keys[e.code] = true; this.anyKeyPressed = true; });
        window.addEventListener('keyup', e => { this.keys[e.code] = false; this.anyKeyPressed = false; });
    }

    isDown(code) { return !!this.keys[code]; }
}
