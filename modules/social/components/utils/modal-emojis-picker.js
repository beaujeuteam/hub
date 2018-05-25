import { Component, core } from 'angular-js-proxy';
import emojione from 'emojione';

import { Emoji } from './../../services/emoji';

@Component({
    outputs: ['onSelect'],
    selector: 'social-modal-emojis-picker-component',
    styles: [
        '.emojis-content { max-height: 200px; overflow: auto; }',
        '.emojis-content img { cursor: pointer; margin: 5px; }'
    ],
    template: `
        <div class="modal fade" id="emojis-picker">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Emojis picker</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div class="modal-body">
                        <ul class="nav nav-pills mb-2">
                            <li class="nav-item">
                                <a (click)="button = 'people'" href="#people" class="nav-link" data-toggle="pill"><i class="fa fa-user"></i></a>
                            </li>
                            <li class="nav-item">
                                <a (click)="button = 'nature'" href="#nature" class="nav-link" data-toggle="pill"><i class="fa fa-leaf"></i></a>
                            </li>
                            <li class="nav-item">
                                <a (click)="button = 'food'" href="#food" class="nav-link" data-toggle="pill"><i class="fa fa-cutlery"></i></a>
                            </li>
                            <li class="nav-item">
                                <a (click)="button = 'activity'" href="#activity" class="nav-link" data-toggle="pill"><i class="fa fa-gamepad"></i></a>
                            </li>
                            <li class="nav-item">
                                <a (click)="button = 'travel'" href="#travel" class="nav-link" data-toggle="pill"><i class="fa fa-car"></i></a>
                            </li>
                            <li class="nav-item">
                                <a (click)="button = 'objects'" href="#objects" class="nav-link" data-toggle="pill"><i class="fa fa-bomb"></i></a>
                            </li>
                            <li class="nav-item">
                                <a (click)="button = 'symbols'" href="#symbols" class="nav-link" data-toggle="pill"><i class="fa fa-heart"></i></a>
                            </li>
                            <li class="nav-item">
                                <a (click)="button = 'flags'" href="#flags" class="nav-link" data-toggle="pill"><i class="fa fa-flag"></i></a>
                            </li>
                            <li class="nav-item">
                                <a (click)="button = 'search'" href="#search" class="nav-link active" data-toggle="pill"><i class="fa fa-search"></i></a>
                            </li>
                        </ul>

                        <div class="tab-content emojis-content">
                            <div *ngIf="button == 'people'" id="people" class="tab-pane fade">
                                <img *ngFor="let emoji of emoji.getByCategory('people')" (click)="onClick(emoji)" [src]="emoji.url" [title]="emoji.name"/>
                            </div>

                            <div *ngIf="button == 'nature'" id="nature" class="tab-pane fade">
                                <img *ngFor="let emoji of emoji.getByCategory('nature')" (click)="onClick(emoji)" [src]="emoji.url" [title]="emoji.name"/>
                            </div>

                            <div *ngIf="button == 'food'" id="food" class="tab-pane fade">
                                <img *ngFor="let emoji of emoji.getByCategory('food')" (click)="onClick(emoji)" [src]="emoji.url" [title]="emoji.name"/>
                            </div>

                            <div *ngIf="button == 'activity'" id="activity" class="tab-pane fade">
                                <img *ngFor="let emoji of emoji.getByCategory('activity')" (click)="onClick(emoji)" [src]="emoji.url" [title]="emoji.name"/>
                            </div>

                            <div *ngIf="button == 'travel'" id="travel" class="tab-pane fade">
                                <img *ngFor="let emoji of emoji.getByCategory('travel')" (click)="onClick(emoji)" [src]="emoji.url" [title]="emoji.name"/>
                            </div>

                            <div *ngIf="button == 'objects'" id="objects" class="tab-pane fade">
                                <img *ngFor="let emoji of emoji.getByCategory('objects')" (click)="onClick(emoji)" [src]="emoji.url" [title]="emoji.name"/>
                            </div>

                            <div *ngIf="button == 'symbols'" id="symbols" class="tab-pane fade">
                                <img *ngFor="let emoji of emoji.getByCategory('symbols')" (click)="onClick(emoji)" [src]="emoji.url" [title]="emoji.name"/>
                            </div>

                            <div *ngIf="button == 'flags'" id="flags" class="tab-pane fade">
                                <img *ngFor="let emoji of emoji.getByCategory('flags')" (click)="onClick(emoji)" [src]="emoji.url" [title]="emoji.name"/>
                            </div>

                            <div id="search" class="tab-pane fade show active">
                                <form (submit)="onSubmit($event)" class="m-2">
                                    <div class="input-group">
                                        <input (keyup)="onSubmit($event)" [(ngModel)]="text" id="text" type="text" name="text" class="form-control"/>
                                        <div class="input-group-append">
                                            <button class="btn btn-primary">Search</button>
                                        </div>
                                    </div>
                                </form>

                                <img *ngFor="let emoji of result" (click)="onClick(emoji)" [src]="emoji.url" [title]="emoji.name"/>
                            </div>
                        </div>

                        <p class="text-muted text-right">
                            <small>
                                <i>Emoji icons supplied by <a href="https://www.emojione.com" target="_blank">EmojiOne</a></i>
                            </small>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `,
    providers: [Emoji]
})
export class ModalEmojisPickerComponent {

    /**
     * @param {Emoji} emoji
     */
    constructor(emoji) {
        this.emoji = emoji;
        this.onSelect = new core.EventEmitter();
        this.text = null;
        this.result = this.emoji.search();
        this.button = 'search';
    }

    /**
     * @param {Event} event
     */
    onClick(emoji) {
        this.onSelect.emit({ emoji });
    }

    /**
     * @param {Event} event
     */
    onSubmit(event) {
        event.preventDefault();

        if (null !== this.text && this.text.length >= 2) {
            this.result = this.emoji.search(this.text);
        }
    }
}
