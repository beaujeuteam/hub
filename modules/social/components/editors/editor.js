import { core } from 'angular-js-proxy';
import { Textcomplete } from 'textcomplete';

export class Editor {

    constructor(emojiRepository, userRepository, messagesRepository) {
        this.emoji = emojiRepository;
        this.users = userRepository;
        this.messages = messagesRepository;

        this.reset = 0;
        this.editor = null;
        this.showEmojis = false;
        this.onChange = new core.EventEmitter();
    }

    initAutoComplete(editor) {
        const textcomplete = new Textcomplete(editor, {
            dropdown: {
                item: { className: 'dropdown-item' }
            }
        });

        textcomplete.register([
            {
                id: 'emojis',
                match: /\B:([\-+\w]*)$/,
                search: (term, callback) => {
                    term = !!term ? term : undefined;
                    callback(this.emoji.search(term));
                },
                template: emoji => `<img src="${emoji.url}"> ${emoji.shortname}`,
                replace: emoji => `${emoji.shortname} `,
                index: 1
            },
            {
                id: 'tags',
                match: /\B#([\-\w]*)$/,
                search: (term, callback) => {
                    const id = this.messages
                        .query('search-tags', { search: term }, (query) => {
                            callback(query.result);
                            this.messages.unsubscribe(id);
                        });
                },
                template: tag => `#${tag}`,
                replace: tag => `#${tag} `,
                index: 1
            },
            {
                id: 'users',
                match: /\B@([\-\w]*)$/,
                search: (term, callback) => {
                    this.users
                        .search(term)
                        .then(users => callback(users));
                },
                template: user => `<img class="rounded-circle"
                    src="${user.attributes.avatar}"
                    title="@${user.username}"
                    width="20" height="20"> @${user.username}`,
                replace: user => `@${user.username} `,
                index: 1
            }
        ]);

        return textcomplete;
    }

    /**
     * @param {string} text
     *
     * @return {Array}
     */
    parseTags(text) {
        const tags = text.match(/#([a-zA-Z0-9]+)/g) || [];

        return tags.map(tag => tag.replace('#', ''));
    }

    /**
     * @param {string} text
     *
     * @return {Array}
     */
    parseMentions(text) {
        const mentions = text.match(/@([a-zA-Z0-9-_]+)/g) || [];

        return mentions.map(mention => mention.replace('@', ''));
    }

    /**
     * Clean text
     * @param {string} text
     *
     * @return {string}
     */
    clean(text) {
        if (/.*\n$/.test(text)) {
            return text.slice(0, -1);
        }

        return text;
    }

    update(content) {
        content = this.clean(content);
        this.onChange.emit({
            content,
            tags: this.parseTags(content),
            mentions: this.parseMentions(content)
        });
    }
}
