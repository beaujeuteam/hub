import { Component } from 'angular-js-proxy';

import { Repository } from './../../../modules/common';
import { CommonUtils } from './../../../modules/common';

@Component({
    styles: [
        '.topic-item { transition: all .3s; }',
        '.topic-item:hover { background-color: #f8f9fa; border-radius: 5px; transition: all .5s; }',
        '.topic-item-link { color: inherit; text-decoration: none; outline : none; }'
    ],
    template: `
        <header *ngIf="category" class="text-center bg-light p-4">
            <h2>{{ category.name }}</h2>
            <p>{{ category.description }}</p>
        </header>

        <section class="container">
            <div class="row">
                <div class="col-md-2">
                    <div class="mb-4">
                        <a [routerLink]="['/forum']" class="d-block m-2 text-muted">
                            <i class="fa fa-home"></i> Accueil
                        </a>
                        <!--<a [routerLink]="['/forum']" class="d-block m-2">
                            <i class="fa fa-th-large"></i> Tags
                        </a>-->
                    </div>

                    <div class="mb-4 mt-4">
                        <a *ngFor="let category of subcategories"
                            [routerLink]="['/forum/category', category._id, utils.stringToURL(category.name)]"
                            class="d-block m-2 text-dark"
                        >
                            <i class="fa fa-square"></i> {{ category.name }}
                        </a>
                    </div>
                </div>

                <div class="col-md-10">
                    <nav class="clearfix">
                        <a *ngIf="category"
                            [routerLink]="['/forum/category', category._id, utils.stringToURL(category.name), 'new-topic']"
                            class="btn btn-outline-success"
                        >
                            Nouveau topic
                        </a>
                        <form class="form-inline pull-right">
                            <select [(ngModel)]="sort" (change)="onChange()" name="sort"
                                class="form-control custom-select"
                            >
                                <option value="newest">Nouveau</option>
                                <option value="latest">Plus récent</option>
                                <option value="oldest">Ancien</option>
                            </select>
                        </form>
                    </nav>

                    <div class="mb-4 mt-4">
                        <p *ngIf="topics.length == 0 && !loading" class="alert alert-info">
                            Aucun topic ici
                        </p>

                        <a *ngFor="let topic of topics"
                            class="topic-item-link"
                            [routerLink]="['/forum/topic', topic._id, utils.stringToURL(topic.title)]"
                        >
                            <article class="media p-3 topic-item">
                                <auth-user-avatar-component
                                    [username]="topic.user"
                                    class="mr-3"
                                >
                                </auth-user-avatar-component>

                                <div class="media-body">
                                    <aside class="pull-right">
                                        <category-label-component
                                            [id]="topic.target.id"
                                            class="mr-2"
                                        >
                                        </category-label-component>

                                        <span class="badge badge-primary mr-2 d-none d-sm-inline-block"
                                            *ngFor="let tag of topic.tags"
                                        >
                                            {{ tag }}
                                        </span>

                                        <topic-comments-counter-component
                                            [id]="topic._id"
                                        >
                                        </topic-comments-counter-component>
                                    </aside>

                                    <h5 class="m-0">{{ topic.title }}</h5>
                                    <small>{{ topic.created_at | date }}</small>
                                </div>
                            </article>
                        </a>

                        <common-article-loading-component *ngIf="loading"></common-article-loading-component>
                    </div>
                </div>
            </div>
        </section>
    `,
    providers: [Repository, CommonUtils]
})
export class ForumComponent {
    constructor(repository, utils, ActivatedRoute) {
        this.repository = repository;
        this.utils = utils;
        this.route = ActivatedRoute;

        this.sort = 'newest';
        this.category = null;
        this.subcategories = [];
        this.topics = [];
        this.sub = null;
        this.loading = true;
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            let categoriesParams = {};
            let topicsParams = { type: 'topic' };

            if (!!params.id) {
                categoriesParams = { parent: params.id };
                topicsParams = { target: { type: 'category', id: params.id }, type: 'topic' };

                this.repository.query('find-category', { id: params.id }, query => {
                    this.category = query.result;
                });
            }

            this.repository.query('find-categories', categoriesParams, query => {
                this.subcategories = query.result;
            });

            if (this.sort === 'newest') {
                topicsParams.sort = { created_at: -1, edited_at: -1 };
            }

            if (this.sort === 'latest') {
                topicsParams.sort = { edited_at: -1, created_at: -1 };
            }

            if (this.sort === 'oldest') {
                topicsParams.sort = { edited_at: 1, created_at: 1 };
            }

            this.repository.query('find-messages', topicsParams, query => {
                this.topics = query.result;
                this.loading = false;
            });
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
        this.repository.clear();
    }

    onChange() {
        this.ngOnInit();
    }
}
