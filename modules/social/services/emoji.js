import { Injectable } from 'angular-js-proxy';
import emojione from 'emojione';

@Injectable()
export class Emoji {
    constructor() {
        this.emojis = [];
        const emojis = require('emojione/emoji.json');

        let emoji = {};
        for (let id in emojis) {
            this.emojis.push(Object.assign({ url: `${emojione.imagePathPNG}32/${id}.png` }, emojis[id]));
        }
    }

    /**
     * @param {string} [category=people]
     * @return {Array}
     */
    getByCategory(category = 'people') {
        return this.emojis.filter(emoji => emoji.category === category && emoji.diversity === null)
            .sort((a, b) => a.order - b.order);
    }

    /**
     * @param {string} [search=smile]
     * @return {Array}
     */
    search(search = 'smile') {
        search = search.replace('+', '');

        return this.emojis.filter(emoji => {
            const regexp = new RegExp(`^${search}`, 'i');
            return emoji.name.match(regexp) || emoji.keywords.some(el => el === search);
        });
    }
}
