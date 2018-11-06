import { Auth } from 'pxl-angular-auth';
import { Repository, CommonUtils } from 'pxl-angular-common';

@Component({
    template: `
        <header *ngIf="game" class="text-center bg-info text-white p-4">
            <h2>{{ game.name }}</h2>
        </header>

        <section role="main" class="container">
            <div *ngIf="!!game" class="row">
                <div class="col-md-8">
                    <div class="media mb-4">
                        <img *ngIf="!!game.cover"
                            class="pull-left rounded mr-3"
                            [src]="game.cover.small"
                            [title]="game.name"
                            [alt]="game.name">

                        <div *ngIf="!!info" class="media-body">
                            <h5 class="mt-0">Sortie le {{ game.released_at | date }}</h5>
                            <p>{{ utils.subString(info.summary, 200) }}</p>
                            <p>Plus d'info sur <a [href]="info.url" target="_blank">IGDB.com</a></p>
                        </div>

                        <common-label-loading-component
                            *ngIf="!info"
                            [width]="100"
                            [height]="23"
                            [className]="'d-inline-block'">
                        </common-label-loading-component>
                    </div>

                    <h5>Stream(s) en cours</h5>

                    <p class="alert alert-info">Aucun stream pour l'instant</p>

                    <h5 class="mt-4">
                        Screenshot(s) de la communauté
                        <small class="pull-right">
                            <common-images-uploader-component
                                (onLoad)="onScreenshotLoaded($event)"
                                [text]="'ajouter'"
                                [noButton]="true"
                                [resize]="true"
                            ></common-images-uploader-component>
                        </small>
                    </h5>

                    <p *ngIf="medias.length == 0" class="alert alert-info">
                        Aucun screenshot du jeu
                    </p>

                    <div class="card-columns">
                        <div *ngFor="let media of medias" class="mb-3">
                            <social-media-component
                                [id]="media._id"
                                [className]="'img-fluid'"
                            >
                            </social-media-component>
                        </div>
                    </div>

                    <!--<h5 class="mt-4">Vidéo(s) de la communauté</h5>-->

                    <!--<p class="alert alert-info">Aucune vidéo du jeu, <a href="">ajoute en une ;)</a></p>-->
                </div>

                <div class="col-md-4">
                    <p>Joueur(s) possèdant ce jeu</p>
                    <auth-user-avatar-component *ngFor="let user of game.users"
                        [username]="user">
                    </auth-user-avatar-component>

                    <div *ngIf="!!game.users_to_play && game.users_to_play.length > 0"
                        class="mt-3"
                    >
                        <p>Joueur(s) voulant jouer</p>
                        <auth-user-avatar-component *ngFor="let user of game.users_to_play"
                            [username]="user">
                        </auth-user-avatar-component>
                    </div>

                    <div *ngIf="!!game.users_to_own && game.users_to_own.length > 0"
                        class="mt-3"
                    >
                        <p>Joueur(s) voulant ce jeu</p>
                        <auth-user-avatar-component *ngFor="let user of game.users_to_own"
                            [username]="user">
                        </auth-user-avatar-component>
                    </div>

                    <hr>

                    <form>
                        <div class="form-group">
                            <div class="custom-control custom-checkbox">
                                <input (change)="toggleUserWantToPlay()" id="user-want-play" class="custom-control-input" type="checkbox" [checked]="isUserWantToPlay()">
                                <label class="custom-control-label" for="user-want-play">Je veux jouer à ce jeu !</label>
                            </div>
                        </div>

                        <div *ngIf="!isUserAlreadyOwnGame()" class="form-group">
                            <div class="custom-control custom-checkbox">
                                <input (change)="toggleUserWantToOwn()" id="user-want-own" class="custom-control-input" type="checkbox" [checked]="isUserWantToOwn()">
                                <label class="custom-control-label" for="user-want-own">Je veux ce jeu !</label>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    `,
    inject: [Repository, CommonUtils, Auth, ng.router.ActivatedRoute]
})
export class GameComponent {
    constructor(repository, utils, auth, ActivatedRoute) {
        this.repository = repository;
        this.utils = utils;
        this.auth = auth;
        this.route = ActivatedRoute;

        this.medias = [];
        this.game = null;
        this.info = null;
        this.sub = null;
        this.queryIds = [null, null];
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe((params) => {
            if (!!params['id']) {
                this.queryIds[0] = this.repository.subscribe('games:get', { id: params['id'] }, (query) => {
                    this.game = query.result;

                    if (null === this.info) {
                        this.repository.query('games:search-one', { gameId: this.game.gameId }, (query) => {
                            this.info = query.result;
                        });
                    }
                });

                this.queryIds[1] = this.repository.subscribe('medias:find', { target: { type: 'game', id: params['id'] } }, (query) => {
                    this.medias = query.result;
                });
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
        this.repository.unsubscribe(this.queryIds[0]);
        this.repository.unsubscribe(this.queryIds[1]);
    }

    isUserAlreadyOwnGame() {
        const user = this.auth.getUser();

        return this.game.users.find(u => u === user.username);
    }

    isUserWantToPlay() {
        const user = this.auth.getUser();

        return !this.game.users_to_play ? false : this.game.users_to_play.find(u => u === user.username);
    }

    isUserWantToOwn() {
        const user = this.auth.getUser();

        return !this.game.users_to_own ? false : this.game.users_to_own.find(u => u === user.username);
    }

    toggleUserWantToOwn() {
        if (this.isUserWantToOwn()) {
            this.repository.query('games:users-to-own:delete', { id: this.game._id });
        } else {
            this.repository.query('games:users-to-own:insert', { id: this.game._id });
        }
    }

    toggleUserWantToPlay() {
        if (this.isUserWantToPlay()) {
            this.repository.query('games:users-to-play:delete', { id: this.game._id });
        } else {
            this.repository.query('games:users-to-play:insert', { id: this.game._id });
        }
    }

    onScreenshotLoaded({ files }) {
        this.repository.query(
            'medias:insert',
            {
                medias: files.map(f => {
                    return {
                        type: 'image',
                        target: { id: this.game._id, type: 'game' },
                        content: { name: f.name, src: f.src }
                    };
                })
            });
    }
}
