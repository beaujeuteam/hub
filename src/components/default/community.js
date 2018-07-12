import { Component, router } from 'angular-js-proxy';

import { Repository, CommonUtils } from 'pxl-angular-common';

@Component({
    styles: [
        '.card { overflow: hidden; }',
        '.media-link { color: inherit; }',
        '.card-link { color: inherit; }',
        '.card-link .card { transition: all .5s }',
        '.card-link:hover .card { box-shadow: 1px 1px 5px rgba(0, 0, 0, .3); transition: all 1s }'
    ],
    template: `
        <header *ngIf="type && type == 'home'" class="text-center bg-info text-white p-4">
            <h2>Communauté</h2>
        </header>

        <header *ngIf="type && type == 'streams'" class="text-center bg-info text-white p-4">
            <h2>Streams</h2>
            <p>Les derniers streams en cours</p>
        </header>

        <header *ngIf="type && type == 'videos'" class="text-center bg-info text-white p-4">
            <h2>Vidéos</h2>
            <p>Les dernières vidéos</p>
        </header>

        <header *ngIf="type && type == 'games'" class="text-center bg-info text-white p-4">
            <h2>Jeux</h2>
            <p>Tous les jeux joués par la communauté</p>
        </header>

        <section class="container">
            <div class="row">
                <div class="col-md-2">
                    <div class="mb-4">
                        <a [routerLink]="['/community']" class="d-block m-2 text-muted">
                            <i class="fa fa-home"></i> Accueil
                        </a>
                    </div>

                    <div class="mb-4 mt-4">
                        <a [routerLink]="['/community/streams']"
                            class="d-block m-2 text-dark"
                        >
                            <i class="fa fa-wifi"></i> Streams
                        </a>

                        <a [routerLink]="['/community/videos']"
                            class="d-block m-2 text-dark"
                        >
                            <i class="fa fa-video-camera"></i> Vidéos
                        </a>

                        <a [routerLink]="['/community/games']"
                            class="d-block m-2 text-dark"
                        >
                            <i class="fa fa-gamepad"></i> Jeux
                        </a>
                    </div>
                </div>

                <div class="col-md-10">

                    <!-- HOME DIV -->

                    <div *ngIf="type && type == 'home'">
                        <button
                            class="btn btn-outline-success"
                            data-toggle="modal"
                            [attr.data-target]="'#write-message-modal'"
                        >
                                Nouveau message
                        </button>

                        <social-write-message-component [parameters]="messageParameters"></social-write-message-component>

                        <div class="mb-4 mt-4">
                            <p *ngIf="messages.length == 0 && !loading" class="alert alert-info col-md-12">
                                Aucun message pour le moment :'(
                            </p>

                            <div class="card-columns">
                                <div *ngFor="let message of messages" class="mb-4">
                                    <social-message-card-component [id]="message._id"></social-message-card-component>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- STREAM DIV -->

                    <div *ngIf="type && type == 'streams'">
                        <p *ngIf="streams.length == 0 && !loading" class="alert alert-info col-md-12">
                            Aucun stream pour le moment :'(
                        </p>

                        <div *ngFor="let stream of streams" class="col-md-6">
                            <article class="card">
                                <stream-video-component
                                    class="card-img-top"
                                    [auto]="true"
                                    [poster]="stream.poster"
                                    [id]="stream.key">
                                </stream-video-component>

                                <div class="card-body">
                                    <header class="media">
                                        <auth-user-avatar-component class="mr-2"
                                            [username]="stream.user">
                                        </auth-user-avatar-component>

                                        <div class="media-body">
                                            <span class="pull-right">
                                                <i class="fa fa-eye"></i> {{ stream.viewers + 1 }}
                                            </span>
                                            <auth-user-label-component [username]="stream.user"></auth-user-label-component>
                                            <a [routerLink]="['/stream', stream.user]" class="media-link">
                                                <h5>{{ stream.title }}</h5>
                                            </a>
                                        </div>
                                    </header>
                                </div>
                            </article>
                        </div>
                    </div>

                    <!-- VIDEOS DIV -->

                    <div *ngIf="type && type == 'videos'">
                        <p *ngIf="videos.length == 0 && !loading" class="alert alert-info col-md-12">
                            Aucune vidéo pour le moment :'(
                        </p>

                        <div *ngFor="let video of videos" class="col-md-6">
                            <article class="card">
                            </article>
                        </div>
                    </div>

                    <!-- GAMES DIV -->

                    <div *ngIf="type && type == 'games'">
                        <p *ngIf="games.length == 0 && !loading" class="alert alert-info col-md-12">
                            Aucun jeu pour le moment :'(
                        </p>

                        <div class="card-columns">
                            <div *ngFor="let game of games">
                                <a class="card-link" [routerLink]="['/community/game', game._id, utils.stringToURL(game.name)]">
                                    <article class="card">
                                        <img class="card-img-top" [src]="game.cover.big" [alt]="game.name" [title]="game.name">
                                        <div class="card-body">
                                            <h5 class="card-title">{{ game.name }}</h5>
                                        </div>
                                    </article>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `,
    inject: [Repository, CommonUtils, router.ActivatedRoute]
})
export class CommunityComponent {
    constructor(repository, utils, ActivatedRoute) {
        this.repository = repository;
        this.utils = utils;
        this.route = ActivatedRoute;

        this.streams = [];
        this.videos = [];
        this.games = [];
        this.messages = [];
        this.queryIds = [null, null, null];
        this.messageParameters = { type: 'community-message' };

        this.sub = null;
        this.type = null;
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe((params) => {
            this.type = 'home';

            if (!!params['type'] && params['type'] === 'streams') {
                this.queryIds[0] = this.repository.subscribe('streams:find', {}, (query) => {
                    this.streams = query.result;
                });

                this.type = params['type'];
            }

            if (!!params['type'] && params['type'] === 'games') {
                this.queryIds[1] = this.repository.subscribe('games:find', {}, (query) => {
                    this.games = query.result;
                });

                this.type = params['type'];
            }

            if (!!params['type'] && params['type'] === 'videos') {
                this.type = params['type'];
            }

            if (this.type === 'home') {
                this.queryIds[2] = this.repository.subscribe('messages:find', { type: 'community-message' }, (query) => {
                    this.messages = query.result;
                });
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
        this.repository.unsubscribe(this.queryIds[0]);
        this.repository.unsubscribe(this.queryIds[1]);
        this.repository.unsubscribe(this.queryIds[2]);
    }
}
