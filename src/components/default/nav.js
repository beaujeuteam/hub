import { Component } from 'angular-js-proxy';

import { Auth } from 'pxl-angular-auth';

@Component({
    selector: 'nav-component',
    template: `
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container">
                <a [routerLink]="['/']" class="navbar-brand">BJT</a>

                <ul class="navbar-nav d-lg-flex d-none mr-auto">
                    <li *ngIf="auth.isAuthenticated()" class="nav-item active">
                        <a class="nav-link" [routerLink]="['/forum']">Forum</a>
                    </li>

                    <li *ngIf="auth.isAuthenticated()" class="nav-item active">
                        <a class="nav-link" [routerLink]="['/community']">Communauté</a>
                    </li>
                </ul>

                <div class="navbar-nav d-block d-lg-none mr-auto">
                    <a class="btn btn-link text-secondary" [routerLink]="['/forum']">
                        <i class="fa fa-comments"></i>
                    </a>

                    <a class="btn btn-link text-secondary" [routerLink]="['/community']">
                        <i class="fa fa-users"></i>
                    </a>
                </div>

                <ul class="navbar-nav">
                    <auth-nav-buttons [links]="links"></auth-nav-buttons>
                </ul>
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
