import { Component } from 'angular-js-proxy';

import { UsersRepository } from './../services/users';

@Component({
    inputs: ['username', 'url'],
    selector: 'auth-user-avatar-component',
    template: `
        <img *ngIf="!!user && !url"
            [title]="'@' + user.username"
            class="rounded-circle"
            src="{{ user.attributes.avatar }}"
            width="50px" height="50px"
        >

        <a *ngIf="!!user && !!url" [href]="url">
            <img [title]="'@' + user.username"
                class="rounded-circle"
                src="{{ user.attributes.avatar }}"
                width="50px" height="50px"
            >
        </a>

        <common-image-loading-component
            *ngIf="!user && loading"
            [width]="50"
            [height]="50"
            [className]="'rounded-circle'">
        </common-image-loading-component>
    `,
    providers: [UsersRepository]
})
export class UserAvatarComponent {

    /**
     * @param {UsersRepository} repository
     */
    constructor (repository) {
        this.repository = repository;

        this.username = null;
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
