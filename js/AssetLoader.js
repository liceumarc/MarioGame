import { ASSETS } from './constants.js';

export class AssetLoader {
    constructor() {
        this.images = {};
        this.data = {};
    }

    loadImage(key, src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => { this.images[key] = img; resolve(img); };
            img.onerror = reject;
            img.src = src;
        });
    }

    loadJSON(key, src) {
        return fetch(src)
            .then(res => res.json())
            .then(json => { this.data[key] = json; return json; });
    }

    loadAll() {
        return Promise.all([
            this.loadJSON('map', ASSETS.jsonMap),
            this.loadImage('bg', ASSETS.imgBg),
            this.loadImage('mario', ASSETS.imgMario),
            this.loadImage('title', ASSETS.imgTitle),
            this.loadImage('enemies', ASSETS.enemies)
        ]);
    }
}
