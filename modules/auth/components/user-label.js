import { Component } from 'angular-js-proxy';

import { UsersRepository } from './../services/users';

@Component({
    inputs: ['username', 'extended', 'url'],
    selector: 'auth-user-label-component',
    styles: [
        'a.user-link { color: inherit; }'
    ],
    template: `
        <a *ngIf="!!user && !!url" class="user-link" [href]="url">
            <strong *ngIf="extended">{{ user.firstname }} {{ user.lastname }}</strong> @{{ user.username }}
        </a>

        <span *ngIf="!!user && !url" class="user-link">
            <strong *ngIf="extended">{{ user.firstname }} {{ user.lastname }}</strong> @{{ user.username }}
        </span>

        <common-label-loading-component *ngIf="!user && loading"></common-label-loading-component>
    `,
    providers: [UsersRepository]
})
export class UserLabelComponent {

    /**
     * @param {UsersRepository} repository
     */
    constructor (repository) {
        this.repository = repository;

        this.username = null;
        this.extended = true;
        this.url = null;

        this.user = null;
        this.loading = false;
    }

    ngOnInit() {
        if (!!this.username) {
            this.loading = true;
            this.repository.findById(this.username)
                .then(user => {
                    this.user = user;
                    this.loading = false;
                });
        }
    }
}
