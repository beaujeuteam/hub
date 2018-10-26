import localeFr from './../config/locale';

ng.common.registerLocaleData(localeFr);

const { enableProdMode, LOCALE_ID } = ng.core;
const { RouterModule } = ng.router;

import boxstore from 'boxstore';
boxstore.set(CONFIG, { immutable: true });

import { HomeComponent } from './components/default/home';
import { ProfileComponent } from './components/default/profile';
import { ForumComponent } from './components/default/forum';
import { TopicComponent } from './components/default/topic';
import { WriteTopicComponent } from './components/default/write-topic';
import { CommunityComponent } from './components/default/community';
import { StreamComponent } from './components/default/stream';
import { GameComponent } from './components/default/game';

import defaultComponents from './components/default';
import utilsComponents from './components/utils';
import services from './services';

import { CommonModule, Client } from 'pxl-angular-common';
import { AuthModule, Auth } from 'pxl-angular-auth';
import { SocialModule } from 'pxl-angular-social';

const routing = RouterModule.forRoot([
    { path: '', component: HomeComponent },
    { path: 'profile', component: ProfileComponent, canActivate: [Auth] },
    { path: 'forum', component: ForumComponent, canActivate: [Auth] },
    { path: 'forum/category/:id/:name', component: ForumComponent, canActivate: [Auth] },
    { path: 'forum/category/:id/:name/new-topic', component: WriteTopicComponent, canActivate: [Auth] },
    { path: 'forum/topic/:id/:name', component: TopicComponent, canActivate: [Auth] },
    { path: 'community', component: CommunityComponent, canActivate: [Auth] },
    { path: 'community/:type', component: CommunityComponent, canActivate: [Auth] },
    { path: 'community/game/:id/:name', component: GameComponent, canActivate: [Auth] },
    { path: 'stream/:username', component: StreamComponent, canActivate: [Auth] }
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
    inject: [Auth, Client]
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

        this.client.on('close', () => {
            this.connected = false;
        });

        let uri = '';
        if (boxstore.get('env') === 'production') {
            uri = `wss://${window.location.host}`;
        } else {
            uri = `ws://${window.location.host}`;
            this.client.on('open', () => logger.debug(`Connected with database at ${uri}`));
        }

        if (this.auth.isAuthenticated()) {
            uri += `?token=${this.auth.token}`;
        }

        this.client.connect(uri);
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
        ng.forms.FormsModule,
        ng.platformBrowser.BrowserModule,
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

ng.platformBrowserDynamic.platformBrowserDynamic().bootstrapModule(AppModule);
