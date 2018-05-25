import { Component } from 'angular-js-proxy';

import { Repository } from './../../../common';

@Component({
    selector: 'social-delete-message-component',
    inputs: ['id', 'redirect'],
    template: `
        <div class="modal fade" *ngIf="!!message" [id]="'delete-modal-' + message._id">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Do you really want to delete this message ?</h5>
                    </div>

                    <div *ngIf="!!message" class="modal-body">
                        <social-text-decoration-component
                            [text]="message.content"
                            [limit]="150"
                            [markdown]="message.mimetype == 'markdown'">
                        </social-text-decoration-component>
                    </div>

                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button class="btn btn-danger" (click)="onClick($event)" [disabled]="loading">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    providers: [Repository]
})
export class DeleteMessageComponent {

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
    }

    ngOnInit() {
        this.repository.query('find-message', { id: this.id }, query => {
            this.message = query.result;
        });
    }

    /**
     * @param {Event} event
     */
    onClick(event) {
        event.preventDefault();

        this.loading = true;
        this.repository.query('remove-message', { id: this.id }, () => {
            this.loading = false;

            $('#delete-modal-' + this.id).modal('hide');

            if (!!this.redirect) {
                this.router.navigate([this.redirect]);
            }
        });
    }
}
