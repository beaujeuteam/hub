import { Component } from 'angular-js-proxy';

import { Repository } from './../../../common';

@Component({
    selector: 'social-edit-message-component',
    inputs: ['id', 'redirect'],
    template: `
        <div class="modal fade" *ngIf="!!message" [id]="'edit-modal-' + message._id">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit message</h5>
                    </div>

                    <div *ngIf="!!message" class="modal-body">
                        <div *ngIf="!!message.title" class="form-group">
                            <input [(ngModel)]="data.title" type="text" name="title" class="form-control">
                        </div>

                        <social-markdown-editor-component
                            *ngIf="message.mimetype == 'markdown'"
                            [reset]="reset"
                            [text]="message.content"
                            [noModal]="true"
                            (onChange)="onChange($event)">
                        </social-markdown-editor-component>

                        <social-simple-editor-component
                            *ngIf="message.mimetype == 'text'"
                            [reset]="reset"
                            [text]="message.content"
                            [noModal]="true"
                            (onChange)="onChange($event)">
                        </social-simple-editor-component>
                    </div>

                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button class="btn btn-primary" (click)="onClick($event)" [disabled]="loading">Edit</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    providers: [Repository]
})
export class EditMessageComponent {

    /**
     * @param {Repository} repository
     * @param {Router} Router
     */
    constructor(repository, Router) {
        this.repository = repository;
        this.router = Router;

        this.id = null;
        this.redirect = null;

        this.message = null;
        this.loading = false;
        this.reset = 1;

        this.data = {
            id: null,
            title: null,
            content: null,
            tags: [],
            mentions: []
        }
    }

    ngOnInit() {
        this.repository.query('find-message', { id: this.id }, query => {
            this.data.id = query.result._id;
            this.message = query.result;

            if (!!query.result.title) {
                this.data.title = query.result.title;
            }
        });
    }

    /**
     * @param {Event} event
     */
    onChange(event) {
        this.data.content = event.content;
        this.data.tags = event.tags;
        this.data.mentions = event.mentions;
    }

    /**
     * @param {Event} event
     */
    onClick(event) {
        event.preventDefault();

        this.loading = true;
        this.repository.query('update-message', this.data, query => {
            this.loading = false;
            this.reset++;

            $('#edit-modal-' + this.id).modal('hide');

            if (!!this.redirect) {
                this.router.navigate([this.redirect]);
            }
        });
    }
}
