import { Component } from 'angular-js-proxy';
import emojione from 'emojione';

import { SocialUtils } from './../../services/social-utils';

@Component({
    inputs: ['text', 'extended', 'limit', 'markdown'],
    selector: 'social-text-decoration-component',
    template: `
        <p [innerHTML]="text"></p>
    `,
    providers: [SocialUtils]
})
export class TextDecorationComponent {

    /**
     * @param {SocialUtils} utils
     * @param {ElementRef} element
     */
    constructor(utils, ElementRef) {
        this.text = null;
        this.extended = false;
        this.limit = 0;
        this.markdown = false;
        this.utils = utils;
        this.element = ElementRef.nativeElement;

        this.init = false;
    }

    ngOnInit() {
        if (this.limit > 0 && this.text.length > this.limit) {
            this.text = this.utils.stripHtmlTags(this.text);
            this.text = this.text.substring(0, this.limit);
            this.text += ' ...';
        }

        if (this.markdown) {
            const converter = new showdown.Converter({ literalMidWordUnderscores: true });
            this.text = converter.makeHtml(this.text);
        } else {
            this.text = this.utils.nlToBr(this.text);
            this.text = this.utils.linkToA(this.text);
        }

        this.text = this.utils.parseTags(this.text);
        this.text = this.utils.parseMentions(this.text);
        this.text = emojione.toImage(this.text);
    }

    ngOnChanges() {
        if (this.init) {
            this.ngOnInit();
            setTimeout(() => this.ngAfterViewInit(), 500);
        }
    }

    ngAfterViewInit() {
        if (this.extended) {
            const links = this.element.querySelectorAll('a');
            const width = this.element.querySelector('p').offsetWidth;

            for (let i = 0; i < links.length; i++) {
                this.utils.parseYoutubeLink(links[i], width);
                this.utils.parseSoundcloudLink(links[i]);
            }
        }

        this.init = true;
    }
}
