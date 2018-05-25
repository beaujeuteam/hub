import { Component } from 'angular-js-proxy';

import { Auth } from './../../../modules/auth';

@Component({
    selector: 'nav-component',
    template: `
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
            <div class="container">
                <a [routerLink]="['/']" class="navbar-brand">BJT</a>
                <button class="navbar-toggler" data-toggle="collapse" data-target="#navbar">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbar">
                    <ul class="navbar-nav mr-auto">
                        <li *ngIf="auth.isAuthenticated()" class="nav-item active">
                            <a class="nav-link" [routerLink]="['forum']">Forum</a>
                        </li>
                    </ul>

                    <ul class="navbar-nav">
                        <auth-nav-buttons [links]="links"></auth-nav-buttons>
                    </ul>
                </div>
            </div>
        </nav>
    `,
    providers: [Auth]
})
export class NavComponent {
    constructor(auth) {
        this.auth = auth;
        this.links = [{ secure: true, uri: '/#/profile', name: 'My profile' }];
    }
}
