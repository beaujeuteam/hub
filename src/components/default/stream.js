import { Repository } from 'pxl-angular-common';

import { StreamsRepository } from './../../services/streams';

@Component({
    styles: [
        '.comments-container { margin: 10px; padding: 0; list-style: none; }'
    ],
    template: `
        <section role="main" class="container">
            <div class="row">
                <div *ngIf="!!stream" class="col-md-8">
                    <header class="media mb-4">
                        <auth-user-avatar-component [username]="stream.user" class="mr-3"></auth-user-avatar-component>
                        <div class="media-body">
                            <auth-user-label-component [username]="stream.user"></auth-user-label-component>
                            <h5>{{ stream.title }}</h5>
                        </div>
                    </header>

                    <div class="container-fluid">
                        <stream-video-component
                            [auto]="true"
                            [poster]="stream.poster"
                            [id]="stream.key">
                        </stream-video-component>
                    </div>

                    <aside *ngIf="stream.alive" class="text-right">
                        <stream-viewers-counter-component
                            [streamId]="stream.streamId">
                        </stream-viewers-counter-component>
                    </aside>
                </div>

                <div *ngIf="target" class="col-md-4">
                    <h3>Tchat</h3>
                    <ul class="comments-container">
                        <li *ngFor="let comment of comments">
                            <strong>{{ comment.user }}</strong>: {{ comment.content }}
                        </li>
                    </ul>

                    <social-message-reply-component
                        [target]="target">
                    </social-message-reply-component>
                </div>
            </div>
        </section>
    `,
    inject: [Repository, StreamsRepository, ng.router.ActivatedRoute]
})
export class StreamComponent {
    constructor(repository, streamsRepository, ActivatedRoute) {
        this.repository = repository;
        this.streamsRepository = streamsRepository;
        this.route = ActivatedRoute;

        this.stream = null;
        this.target = null;
        this.comments = [];
        this.queryId = null;
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe((params) => {
            if (!!params['username']) {
                this.streamsRepository.query('streams:get', { user: params['username'] }, (query) => {
                    this.stream = query.result;
                    this.target = { type: 'stream', id: this.stream._id };

                    const params = { target: this.target, sort: { created_at: 1 }}
                    this.queryId = this.repository.subscribe('messages:find', params, (query) => {
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
