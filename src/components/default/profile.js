import { StreamsRepository } from './../../services/streams';

import { Repository } from 'pxl-angular-common';
import { Auth } from 'pxl-angular-auth';

@Component({
    template: `
        <section class="container">
            <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                <li class="nav-item">
                    <a class="nav-link active" data-toggle="pill" href="#main">Général</a>
                </li>

                <li class="nav-item">
                    <a class="nav-link" data-toggle="pill" href="#games">Jeux</a>
                </li>

                <li class="nav-item">
                    <a class="nav-link" data-toggle="pill" href="#stream">Stream</a>
                </li>
            </ul>

            <p *ngIf="okMessage" class="alert alert-success">
                {{ okMessage }}
                <button type="button" class="close" (click)="okMessage = null">
                    <span>&times;</span>
                </button>
            </p>

            <div class="tab-content" id="pills-tabContent">

                <!-- GENERAL DIV -->

                <div class="tab-pane fade show active" id="main">Soon</div>

                <!-- GAMES DIV -->

                <div class="tab-pane fade" id="games">
                    <h3>Ma bibliothèque de jeux</h3>

                    <p class="alert alert-info" *ngIf="games.length === 0">Aucun jeu dans votre bibliothèque.</p>

                    <table *ngIf="games.length > 0" class="table table-dark mt-4">
                        <tr>
                            <th>#</th>
                            <th>Titre</th>
                            <th>Action</th>
                        </tr>
                        <tr *ngFor="let game of games">
                            <td>
                                <img *ngIf="game.cover" width="50" [src]="game.cover.small" [title]="game.name" [alt]="game.name">
                            </td>
                            <td>{{ game.name }}</td>
                            <td>
                                <button (click)="removeGame(game)"
                                    class="btn btn-outline-danger"
                                    [title]="'Supprimer ' + game.name"
                                >
                                    <i class="fa fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </table>

                    <form (submit)="onGameSubmit($event)">
                        <div class="form-group">
                            <label for="game">Ajouter un jeu à ma bibliothèque</label>
                            <div class="input-group">
                                <input [(ngModel)]="searchGame" class="form-control" id="game" name="game" type="text">

                                <div class="input-group-append">
                                    <button *ngIf="searchingGames.length > 0"
                                        (click)="clearGameForm($event)"
                                        class="btn btn-outline-secondary"
                                        type="button"
                                        title="Supprimer la recherche"
                                    >
                                        <i class="fa fa-trash"></i>
                                    </button>

                                    <button type="submit" class="btn btn-outline-primary" [disabled]="loading">
                                        Chercher <i *ngIf="loading" class="fa fa-spin fa-spinner"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>

                    <table *ngIf="searchingGames.length > 0" class="table table-sm mt-4">
                        <tr *ngFor="let searchingGame of searchingGames">
                            <td>{{ searchingGame.name }}</td>
                            <td>
                                <button (click)="addGame(searchingGame)"
                                    class="btn btn-sm btn-outline-success"
                                    [title]="'Ajouter ' + searchingGame.name + ' à votre bibliothèque'"
                                >
                                    <i class="fa fa-plus"></i>
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- STREAMS DIV -->

                <div class="tab-pane fade" id="stream">
                    <div class="form-group">
                        <label for="key">URL du serveur de stream</label>
                        <input class="form-control" type="text" value="rtmp://92.222.88.16/live" readonly="readonly">
                    </div>

                    <div class="form-group">
                        <label for="key">Clef du stream</label>
                        <p *ngIf="!!key" class="alert alert-warning">Attention, cette clef doit rester secrète :0</p>
                        <div class="input-group">
                            <input id="key" [(ngModel)]="key" class="form-control" type="text" name="key" readonly="readonly">

                            <div class="input-group-append">
                                <button (click)="generateKey()"
                                    class="btn btn-outline-primary"
                                    type="button"
                                    [disabled]="loadings"
                                >
                                    Générer
                                </button>
                            </div>
                        </div>
                    </div>

                    <form *ngIf="!!key" (submit)="onStreamSubmit($event)">
                        <div class="form-group">
                            <label for="title">Titre du stream</label>
                            <input id="title" [(ngModel)]="streamData.title" class="form-control" type="text" name="title" required="required"/>
                        </div>

                        <div class="form-group">
                            <label for="poster">
                                Poster <small>l'image qui s'affiche quand tu ne stream pas ;)</small>
                            </label>
                            <input id="poster" [(ngModel)]="streamData.poster" class="form-control" type="text" name="poster" placeholder="http://...">
                        </div>

                        <button class="btn btn-success" type="submit">Sauvegarder</button>
                    </form>
                </div>
            </div>
        </section>
    `,
    inject: [Repository, Auth, StreamsRepository]
})
export class ProfileComponent {
    constructor(repository, auth, streams) {
        this.repository = repository;
        this.auth = auth;
        this.streams = streams;

        this.key = null;
        this.loading = false;
        this.searchGame = null;
        this.games = [];
        this.searchingGames = [];
        this.streamData = {
            title: null,
            poster: null
        };
        this.queryIds = [null, null];
        this.okMessage = null;
    }

    ngOnInit() {
        const user = this.auth.getUser();
        this.queryIds[0] = this.streams.subscribe('streams:get', { user: user.username }, (query) => {
            if (!!query.result) {
                this.key = query.result.key;
                this.streamData.title = query.result.title;
                this.streamData.poster = query.result.poster;
            }
        });

        this.queryIds[1] = this.repository.subscribe('users:games:find', {}, (query) => {
            this.games = query.result;
        });
    }

    ngOnDestroy() {
        this.repository.unsubscribe(this.queryIds[0]);
        this.repository.unsubscribe(this.queryIds[1]);
    }

    generateKey() {
        const user = this.auth.getUser();
        this.loading = true;
        this.streams.query('streams:key:generate', { user: user.username }, (query) => {
            this.loading = false;
        });
    }

    addGame(game) {
        const data = {
            name: game.name,
            gameId: game.id,
            imageId: !!game.cover ? game.cover.cloudinary_id : null,
            released_at: game.first_release_date || null
        };

        this.repository.query('games:insert', data, (query) => {
            this.repository.query('games:users:insert', { gameId: game.id });
        });
    }

    removeGame(game) {
        this.repository.query('games:users:delete', { id: game._id });
    }

    clearGameForm(event) {
        event.preventDefault();

        this.searchGame = null;
        this.searchingGames = [];
    }

    onGameSubmit(event) {
        event.preventDefault();

        this.loading = true;
        this.repository.query('games:search', { search: this.searchGame, limit: 5 }, (query) => {
            this.searchingGames = query.result;
            this.loading = false;
        });
    }

    onStreamSubmit(event) {
        event.preventDefault();
        this.okMessage = null;

        const form = event.target;
        const data = {
            key: this.key,
            title: this.streamData.title,
            poster: this.streamData.poster
        };

        this.streams.query('streams:update', data, (query) => {
            this.loading = false;
            this.okMessage = 'Information sauvegardée ;)';
        });
    }
}
