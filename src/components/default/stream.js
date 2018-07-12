import { Component, router } from 'angular-js-proxy';

import { Repository } from 'pxl-angular-common';

@Component({
    template: `
        <section class="container">
            <div class="row">
                <div *ngIf="!!stream" class="col-md-8">
                    <header class="media mb-4">
                        <auth-user-avatar-component [username]="stream.user" class="mr-3"></auth-user-avatar-component>
                        <div class="media-body">
                            <auth-user-label-component [username]="stream.user"></auth-user-label-component>
                            <h5>{{ stream.title }}</h5>
                        </div>
                    </header>

                    <stream-video-component
                        [auto]="true"
                        [poster]="stream.poster"
                        [id]="stream.key">
                    </stream-video-component>

                    <aside *ngIf="stream.alive" class="text-right">
                        <i class="fa fa-eye"></i> {{ stream.viewers + 1 }}
                    </aside>
                </div>

                <div class="col-md-4">
                    <h3>Tchat</h3>
                </div>
            </div>
        </section>
    `,
    inject: [Repository, router.ActivatedRoute]
})
export class StreamComponent {
    constructor(repository, ActivatedRoute) {
        this.repository = repository;
        this.route = ActivatedRoute;

        this.stream = null;
        this.comments = [];
        this.queryId = null;
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe((params) => {
            if (!!params['username']) {
                this.repository.query('streams:get', { user: params['username'] }, (query) => {
                    this.stream = query.result;

                    const params = { target: { type: 'stream', id: this.stream._id } };
                    this.queryId = this.repository.query('messags:find', {}, (query) => {
                        this.comments = query.result;
                    });
                });
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
        this.repository.unsubscribe(this.queryId);
    }
}
