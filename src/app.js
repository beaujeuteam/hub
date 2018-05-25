import { core, router, platformBrowserDynamic, platformBrowser, forms, common } from 'angular-js-proxy';
import { Component, NgModule } from 'angular-js-proxy';
import localeFr from './../config/locale';

common.registerLocaleData(localeFr);

const { enableProdMode, LOCALE_ID } = core;
const { RouterModule, Router } = router;

import boxstore from 'boxstore';
boxstore.set(CONFIG, { immutable: true });

import { HomeComponent } from './components/default/home';
import { ProfileComponent } from './components/default/profile';
import { ForumComponent } from './components/default/forum';
import { TopicComponent } from './components/default/topic';
import { WriteTopicComponent } from './components/default/write-topic';

import defaultComponents from './components/default';
import utilsComponents from './components/utils';
import services from './services';

import { CommonModule, Client } from './../modules/common';
import { AuthModule, Auth } from './../modules/auth';
import { SocialModule } from './../modules/social';

const routing = RouterModule.forRoot([
    { path: '', component: HomeComponent },
    { path: 'profile', component: ProfileComponent, canActivate: [Auth] },
    { path: 'forum', component: ForumComponent, canActivate: [Auth] },
    { path: 'forum/category/:id/:name', component: ForumComponent, canActivate: [Auth] },
    { path: 'forum/category/:id/:name/new-topic', component: WriteTopicComponent, canActivate: [Auth] },
    { path: 'forum/topic/:id/:name', component: TopicComponent, canActivate: [Auth] }
], { useHash: true });

@Component({
    selector: 'app-component',
    template: `
        <nav-component></nav-component>
        <router-outlet></router-outlet>
        <footer class="footer">
            <span class="pull-left">
                ddb <i class="fa fa-square" [class.text-success]="connected" [class.text-danger]="!connected"></i>
            </span>

            © {{ year }} {{ config.name }} v{{ config.version }}
            <span class="d-none d-sm-inline">- kevinbalicot[at]gmail.com - all rights reserved</span>
            - <a target="_blank" [href]="'https://firewall.oauthorize.tk/privacy-policy?client_id=' + auth.clientId">Privacy policy</a>
        </footer>
    `,
    providers: [Auth, Client]
})
class AppComponent {
    constructor (auth, client) {
        this.auth = auth;
        this.client = client;
        this.config = { version: CONFIG.version, name: CONFIG.name };
        this.year = (new Date()).getFullYear();
        this.connected = false;
    }

    ngOnInit() {
        const logger = boxstore.get('logger');

        this.client.on('open', () => {
            this.connected = true;
        });

        if (this.auth.isAuthenticated()) {
            if (boxstore.get('env') === 'production') {
                this.client.connect(`wss://${window.location.host}?token=${this.auth.token}`);
            } else {
                this.client.on('open', () => logger.debug(`Connected with database at ws://${window.location.host}`));
                this.client.connect(`ws://${window.location.host}?token=${this.auth.token}`);
            }
        }
    }
}

@NgModule({
    declarations: [AppComponent].concat(
        defaultComponents,
        utilsComponents
    ),
    imports: [
        CommonModule,
        AuthModule,
        SocialModule,
        forms.FormsModule,
        platformBrowser.BrowserModule,
        routing
    ],
    providers: [
        { provide: LOCALE_ID, useValue: 'fr-FR' }
    ].concat(
        services
    ),
    bootstrap: [AppComponent],
})
class AppModule {
    constructor() {}
}

if ('production' === CONFIG.env) {
    enableProdMode();
}

platformBrowserDynamic.platformBrowserDynamic().bootstrapModule(AppModule);
