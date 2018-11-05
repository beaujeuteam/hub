import { StreamsRepository } from './../../services/streams';

import { Repository, CommonUtils } from 'pxl-angular-common';

@Component({
    styles: [
        '.card { overflow: hidden; }',
        '.card-link { color: inherit; }',
        '.card-link .card { transition: all .5s }',
        '.card-link:hover .card { box-shadow: 1px 1px 5px rgba(0, 0, 0, .3); transition: all 1s }'
    ],
    template: `
        <header class="text-center bg-info text-white p-4">
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

                        <a [routerLink]="['/community/games']"
                            class="d-block m-2 text-dark"
                        >
                            <i class="fa fa-gamepad"></i> Jeux
                        </a>
                    </div>
                </div>

                <div class="col-md-10">
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
        </section>
    `,
    inject: [Repository, CommonUtils]
})
export class CommunityGamesComponent {
    constructor(repository, utils) {
        this.repository = repository;
        this.utils = utils;

        this.games = [];
        this.queryId = null;
    }

    ngOnInit() {
        this.queryId = this.repository.subscribe('games:find', {}, (query) => {
            this.games = query.result;
        });
    }

    ngOnDestroy() {
        this.repository.unsubscribe(this.queryId);
    }
}
