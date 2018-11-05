import { StreamsRepository } from './../../services/streams';

import { Repository } from 'pxl-angular-common';

@Component({
    styles: ['.media-link { color: inherit; }'],
    template: `
        <header class="text-center bg-info text-white p-4">
            <h2>Streams</h2>
            <p>Les derniers streams en cours</p>
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
                    <h3>En direct</h3>

                    <p *ngIf="getStreams().length === 0" class="alert alert-info col-md-12">
                        Aucun stream pour le moment :'(
                    </p>

                    <div *ngFor="let aliveStream of getStreams()" class="col-md-6">
                        <article class="card">
                            <stream-video-component
                                class="card-img-top"
                                [auto]="true"
                                [poster]="aliveStream.poster"
                                [id]="aliveStream.key">
                            </stream-video-component>

                            <div class="card-body">
                                <header class="media">
                                    <auth-user-avatar-component class="mr-2"
                                        [username]="aliveStream.user">
                                    </auth-user-avatar-component>

                                    <div class="media-body">
                                        <span class="pull-right">
                                            <i class="fa fa-eye"></i> {{ aliveStream.viewers }}
                                        </span>
                                        <auth-user-label-component [username]="aliveStream.user"></auth-user-label-component>
                                        <a [routerLink]="['/stream', aliveStream.user]" class="media-link">
                                            <h5>{{ aliveStream.title }}</h5>
                                        </a>
                                    </div>
                                </header>
                            </div>
                        </article>
                    </div>

                    <h3 *ngIf="getStreams(false).length > 0">Tous les streams</h3>
                    <div *ngFor="let stream of getStreams(false)" class="col-md-6">
                        <article *ngIf="stream.poster" class="card">
                            <common-image-loader-component
                                [url]="stream.poster"
                                [title]="stream.title"
                                [className]="'card-img-top'">
                            </common-image-loader-component>

                            <div class="card-body">
                                <header class="media">
                                    <auth-user-avatar-component class="mr-2"
                                        [username]="stream.user">
                                    </auth-user-avatar-component>

                                    <div class="media-body">
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
            </div>
        </section>
    `,
    inject: [StreamsRepository]
})
export class CommunityStreamsComponent {
    constructor(repository) {
        this.repository = repository;

        this.streams = [];
        this.queryId = null;

        this.sub = null;
        this.type = null;
    }

    ngOnInit() {
        this.queryId = this.repository.subscribe('streams:find', {}, (query) => {
            this.streams = query.result;
        });
    }

    getStreams(alive = true) {
        return this.streams.filter(s => s.alive === alive);
    }

    ngOnDestroy() {
        this.repository.unsubscribe(this.queryId);
    }
}
