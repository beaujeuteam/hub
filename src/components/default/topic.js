import { core, Component } from 'angular-js-proxy';

import { Repository, CommonUtils } from './../../../modules/common';

@Component({
    styles: ['.topic-content { font-size: 1.2em; line-height: 32px; }'],
    template: `
        <header *ngIf="!!topic" class="text-center bg-light p-4">
            <h2>{{ topic.title }}</h2>
        </header>

        <section class="container">
            <section *ngIf="!!topic">
                <aside class="media">
                    <auth-user-avatar-component [username]="topic.user" class="mr-3"></auth-user-avatar-component>
                    <div class="media-body">
                        <auth-user-label-component [username]="topic.user"></auth-user-label-component>
                        <aside class="d-block">
                            <small>{{ topic.created_at | date }}</small>
                            <small *ngIf="!!topic.edited_at" class="text-muted">- Edité le {{ topic.edited_at | date }}</small>
                        </aside>
                    </div>

                    <social-actions-button-component
                        class="pull-right"
                        [side]="'right'"
                        [id]="topic._id"
                        [urls]="urls">
                    </social-actions-button-component>
                </aside>

                <div class="mt-4">
                    <social-text-decoration-component
                        class="topic-content"
                        [text]="topic.content"
                        [extended]="true"
                        [markdown]="true">
                    </social-text-decoration-component>
                </div>

                <aside class="d-block mt-4">
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

                    <div class="media">
                        <auth-user-avatar-component [username]="reply.user" class="mr-3"></auth-user-avatar-component>
                        <div class="media-body">
                            <social-actions-button-component
                                class="pull-right"
                                [side]="'right'"
                                [id]="reply._id"
                                [urls]="replyUrls">
                            </social-actions-button-component>

                            <auth-user-label-component [username]="reply.user"></auth-user-label-component>
                            <small class="d-block">{{ reply.created_at | date }}</small>

                            <div class="mt-4">
                                <social-text-decoration-component
                                    [text]="reply.content"
                                    [markdown]="true">
                                </social-text-decoration-component>
                            </div>
                        </div>
                    </div>
                </article>

                <hr>
                <div class="mt-4">
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
    providers: [Repository, CommonUtils]
})
export class TopicComponent {
    constructor(repository, utils, ActivatedRoute) {
        this.repository = repository;
        this.utils = utils;
        this.route = ActivatedRoute;

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
        this.replyUrls = null;
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            if (!!params.id) {
                this.reply.target = { type: 'topic', id: params.id };
                this.repository.query('find-message', { id: params.id }, query => {
                    this.topic = query.result;
                    this.urls = {
                        edit: `/forum/topic/${this.topic._id}/${this.utils.stringToURL(this.topic.title)}`,
                        delete: `/forum`
                    };

                    this.replyUrls = { edit: this.urls.edit, delete: this.urls.edit };
                });

                this.repository.query('find-messages', { target: { type: 'topic', id: params.id } }, query => {
                    this.replies = query.result;
                });
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
        this.repository.clear();
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
        this.repository.query('insert-message', this.reply, query => {
            const message = query.result.ops[0];
            this.loading = false;
            this.reset++;
        });
    }

    isValidate() {
        return !!this.reply.content;
    }
}
