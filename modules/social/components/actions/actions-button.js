import { Component } from 'angular-js-proxy';

import { Repository } from './../../../common';
import { Auth } from './../../../auth';

@Component({
    selector: 'social-actions-button-component',
    inputs: ['id', 'side', 'urls'],
    template: `
        <div *ngIf="!!message && user.username == message.user" class="dropdown">
            <button class="btn btn-light dropdown-toggle" data-toggle="dropdown">
                <i class="fa fa-gear"></i>
            </button>

            <div class="dropdown-menu" [class.dropdown-menu-right]="side == 'right'">
                <a class="dropdown-item"
                    href="#" data-toggle="modal"
                    [attr.data-target]="'#edit-modal-' + message._id"
                >
                    Edit
                </a>

                <a class="dropdown-item text-danger"
                    href="#" data-toggle="modal"
                    [attr.data-target]="'#delete-modal-' + message._id"
                >
                    Delete
                </a>
            </div>

            <social-delete-message-component [id]="id" [redirect]="urls.delete"></social-delete-message-component>
            <social-edit-message-component [id]="id" [redirect]="urls.edit"></social-edit-message-component>
        </div>
    `,
    providers: [Repository, Auth]
})
export class ActionsButtonComponent {

    /**
     * @param {Repository} repository
     * @param {Auth} auth
     */
    constructor(repository, auth) {
        this.repository = repository;
        this.auth = auth;

        this.id = null;
        this.side = 'left';
        this.urls = {
            edit: null,
            delete: null
        };

        this.user = null;
        this.message = null;
        this.loading = false;
    }

    ngOnInit() {
        this.user = this.auth.getUser();

        this.repository.query('find-message', { id: this.id }, query => {
            this.message = query.result;
        });
    }
}
