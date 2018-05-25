import { Component } from 'angular-js-proxy';

import { Auth } from './../services/auth';

@Component({
    selector: 'auth-nav-buttons',
    inputs: ['links'],
    template: `
        <li class="dropdown nav-item">
            <a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown">
                <i class="fa fa-user"></i> {{ username }}
            </a>

            <div class="dropdown-menu dropdown-menu-right">
                <a class="dropdown-item" *ngIf="!auth.isAuthenticated()" [href]="auth.loginURL">Sign in</a>
                <a class="dropdown-item" *ngIf="!auth.isAuthenticated()" [href]="auth.signupURL">Sign up</a>

                <a *ngFor="let link of availableLinks" class="dropdown-item" href="{{ link.uri }}">{{ link.name }}</a>

                <a class="dropdown-item" *ngIf="auth.isAuthenticated()" [href]="auth.updateURL">My informations</a>
                <a class="dropdown-item" *ngIf="auth.isAuthenticated()" href="#" (click)="logout()">Logout</a>
            </div>
        </li>
    `,
    providers: [Auth]
})
export class AuthNavButtonsComponent {
    constructor(auth) {
        this.auth = auth;
        this.links = [];

        this.username = '';
    }

    ngOnInit() {
        const user = this.auth.getUser();
        this.username = !!user ? user.username : '';
    }

    logout() {
        this.auth.logout();
        location.reload();
    }

    get availableLinks() {
        return this.links.filter(l => l.secure == this.auth.isAuthenticated());
    }
}
