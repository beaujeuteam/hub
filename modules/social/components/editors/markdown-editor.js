import { Component, core } from 'angular-js-proxy';
import CodemirrorEditor from 'textcomplete.codemirror';
import SimpleMDE from 'simplemde';

import { Repository } from './../../../common';
import { UsersRepository } from './../../../auth';

import { Editor } from './editor';
import { Emoji } from './../../services/emoji';

@Component({
    selector: 'social-markdown-editor-component',
    inputs: ['text', 'placeholder', 'reset', 'noModal'],
    outputs: ['onChange'],
    template: `
        <social-emojis-picker-component
            *ngIf="!!noModal && !!showEmojis"
            (onSelect)="onSelectEmoji($event)"
        >
        </social-emojis-picker-component>

        <textarea></textarea>

        <social-modal-emojis-picker-component
            *ngIf="!noModal"
            (onSelect)="onSelectEmoji($event)"
        >
        </social-modal-emojis-picker-component>
    `,
    providers: [Emoji, UsersRepository, Repository]
})
export class MarkdownEditorComponent extends Editor {
    constructor(emoji, users, messages, ElementRef) {
        super(emoji, users, messages);

        this.element = ElementRef;

        this.placeholder = '';
        this.text = '';
        this.noModal = false;

        this.onChange = new core.EventEmitter();
    }

    ngOnChanges() {
        if (null !== this.editor) {
            this.editor.value(this.text);
        }
    }

    ngAfterViewInit() {
        this.editor = new SimpleMDE({
            element: this.element.nativeElement.querySelector('textarea'),
            placeholder: this.placeholder,
            initialValue: this.text,
            forceSync: true,
            toolbar: [
                'bold', 'italic', 'heading',
                {
                    name: "emojis-picker",
                    action: () => {
                        if (!!this.noModal) {
                            this.showEmojis = !this.showEmojis;
                        } else {
                            $('#emojis-picker').modal('show');
                        }
                    },
                    className: "fa fa-smile-o",
                    title: "Emojis picker",
                },
                '|',
                'quote', 'unordered-list', 'ordered-list', '|',
                'link', 'image', '|',
                'preview', 'side-by-side', 'fullscreen', '|', 'guide'
            ]
        });

        this.editor.codemirror.on("change", () => {
            this.update(this.editor.value());
        });

        const textCompleteEditor = new CodemirrorEditor(this.editor.codemirror);
        this.initAutoComplete(textCompleteEditor);
    }

    /**
     * @param {Event} event
     */
    onSelectEmoji(event) {
        this.editor.value(this.editor.value() + `${event.emoji.shortname} `);
    }
}
