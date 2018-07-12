import { Component, router } from 'angular-js-proxy';

import { Repository, CommonUtils } from 'pxl-angular-common';
import { Auth } from 'pxl-angular-auth';

@Component({
    template: `
        <header *ngIf="!!topic" class="text-center bg-success text-white p-4">
            <h2>{{ topic.title }}</h2>
            <i *ngIf="topic.metadata.blocked" title="Topic fermé" class="fa fa-lock"></i>
            <i *ngIf="topic.metadata.pinned" title="Topic épinglé" class="fa fa-thumb-tack"></i>
        </header>

        <section class="container">
            <section *ngIf="!!topic">
                <social-message-card-component
                    [id]="topic._id"
                    [extended]="true"
                    [urls]="urls"
                    [actions]="actions"
                    [displayFooter]="false"
                    [className]="'topic-content'"
                >
                </social-message-card-component>

                <aside class="d-block">
                    <i class="fa fa-tag"></i>
                    <category-label-component class="mr-2 ml-2" [id]="topic.target.id"></category-label-component>
                    <span class="badge badge-primary mr-2"
                        *ngFor="let tag of topic.tags"
                    >
                        {{ tag }}
                    </span>
                </aside>

                <article *ngFor="let reply of replies">
                    <hr>

                    <social-message-card-component
                        [id]="reply._id"
                        [displayFooter]="false"
                        [className]="'topic-reply'"
                    >
                    </social-message-card-component>
                </article>

                <hr>

                <p *ngIf="topic.metadata.blocked" class="alert alert-info">Le topic a été fermé.</p>

                <div *ngIf="!topic.metadata.blocked" class="mt-4">
                    <form (submit)="onSubmit($event)">
                        <social-markdown-editor-component
                            (onChange)="onEditorChange($event)"
                            [reset]="reset"
                            [placeholder]="'Ecrire une réponse'">
                        </social-markdown-editor-component>

                        <button type="submit" class="btn btn-success" [disabled]="!isValidate() || loading">
                            Envoyer <i *ngIf="loading" class="fa fa-spin fa-spinner"></i>
                        </button>
                    </form>
                </div>
            </section>
        </section>
    `,
    inject: [Repository, CommonUtils, Auth, router.ActivatedRoute]
})
export class TopicComponent {
    constructor(repository, utils, auth, route) {
        this.repository = repository;
        this.utils = utils;
        this.auth = auth;
        this.route = route;

        this.topic = null;
        this.sub = null;
        this.replies = [];
        this.reset = 0;
        this.loading = false;
        this.reply = {
            content: null,
            tags: [],
            mentions: [],
            mimetype: 'markdown',
            target: { type: 'topic', id: null }
        };
        this.urls = null;
        this.actions = [];
        this.replyUrls = null;
        this.queryId = null;
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            if (!!params.id) {
                this.reply.target = { type: 'topic', id: params.id };
                this.repository.query('messages:get', { id: params.id }, query => {
                    this.topic = query.result;
                    this.urls = {
                        edit: { refresh: true },
                        delete: { url: `/forum` }
                    };

                    if (this.auth.token.isGranted('beaujeuteam:topics:pin')) {
                        this.actions.push({
                            name: this.topic.metadata.pinned ? 'Désépingler' : 'Epingler',
                            callback: () => this.pinTopic(),
                            className: 'text-warning',
                            refresh: true
                        });
                    }

                    if (this.auth.token.isGranted('beaujeuteam:topics:block')) {
                        this.actions.push({
                            name: this.topic.metadata.blocked ? 'Ouvrir' : 'Fermer',
                            callback: () => this.blockTopic(),
                            className: 'text-warning',
                            refresh: true
                        });
                    }
                });

                this.queryId = this.repository.subscribe('messages:find', { target: { type: 'topic', id: params.id } }, query => {
                    this.replies = query.result;
                });
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
        this.repository.unsubscribe(this.queryId);
    }

    onEditorChange(event) {
        this.reply.content = event.content;
        this.reply.tags = event.tags;
        this.reply.mentions = event.mentions;
    }

    onSubmit(event) {
        event.preventDefault();

        if (!this.isValidate()) {
            return;
        }

        this.loading = true;
        this.repository.query('messages:insert', this.reply, query => {
            const message = query.result.ops[0];
            this.loading = false;
            this.reset++;
        });
    }

    pinTopic() {
        this.repository.query('forum:topics:pin', { id: this.topic._id });
    }

    blockTopic() {
        this.repository.query('forum:topics:block', { id: this.topic._id });
    }

    isValidate() {
        return !!this.reply.content;
    }
}
