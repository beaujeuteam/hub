import { Component, core } from 'angular-js-proxy';
import { Textarea } from 'textcomplete';

import { UsersRepository } from './../../../auth';
import { Repository } from './../../../../modules/common';

import { Emoji } from './../../services/emoji';
import { SocialUtils } from './../../services/social-utils';
import { Editor } from './editor';

@Component({
    selector: 'social-simple-editor-component',
    inputs: ['reset', 'placeholder', 'text', 'noModal'],
    outputs: ['onChange'],
    styles: [
        '.emojis-button { position: absolute; right: 10px; bottom: 5px; cursor: pointer; font-size: 1.5em; }'
    ],
    template: `
        <social-emojis-picker-component
            *ngIf="!!noModal && !!showEmojis"
            (onSelect)="onSelectEmoji($event)"
        >
        </social-emojis-picker-component>

        <div class="position-relative form-group">
            <span (click)="openEmojisPicker()" class="emojis-button" title="Emoji"><i class="fa fa-smile-o"></i></span>
            <textarea (keyup)="onKeyup($event)" class="editor form-control" [placeholder]="placeholder"></textarea>
        </div>

        <social-modal-emojis-picker-component
            *ngIf="!noModal"
            (onSelect)="onSelectEmoji($event)"
        >
        </social-modal-emojis-picker-component>
    `,
    providers: [Emoji, UsersRepository, Repository, SocialUtils]
})
export class SimpleEditorComponent extends Editor {

    constructor(
        emoji,
        users,
        messages,
        utils,
        ElementRef
    ) {
        super(emoji, users, messages);

        this.element = ElementRef.nativeElement;
        this.utils = utils;

        this.placeholder = '';
        this.text = null;
        this.noModal = false;

        this.timer = null;
    }

    ngOnChanges() {
        if (null !== this.editor) {
            this.editor.value = null;
        }
    }

    ngAfterViewInit() {
        this.editor = this.element.querySelector('.editor');

        const textCompleteEditor = new Textarea(this.element.querySelector('.editor'));
        this.initAutoComplete(textCompleteEditor);

        if (null !== this.text) {
            this.editor.value = this.text;
        }
    }

    initAutoComplete(editor) {
        const textcomplete = super.initAutoComplete(editor);
        textcomplete.on('selected', () => this.onKeyup());
    }

    /**
     * @param {Event} event
     */
    onSelectEmoji(event) {
        this.utils.insertAtCaret(this.editor, event.emoji.shortname);
        this.onKeyup();
    }

    /**
     * @param {Event} event
     */
    onKeyup(event) {
        clearTimeout(this.timer);

        if (13 === event.keyCode) {
            return this.update(this.editor.value);
        }

        this.timer = setTimeout(() => this.update(this.editor.value), 500);
    }

    openEmojisPicker() {
        if (!!this.noModal) {
            this.showEmojis = !this.showEmojis;
        } else {
            $('#emojis-picker').modal('show');
        }
    }
}
