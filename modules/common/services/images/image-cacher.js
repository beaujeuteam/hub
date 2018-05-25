import { Injectable } from 'angular-js-proxy';

@Injectable()
export class ImageCacher {
    constructor() {
        this.cache = new Map();
    }

    get(key) {
        return this.cache.get(key);
    }

    set(key, value) {
        return this.cache.set(key, value);
    }
}
