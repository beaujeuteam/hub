import { Repository, CommonUtils } from 'pxl-angular-common';

// inspiration https://discuss.flarum.org/

@Component({
    styles: [
        '.topic-item { transition: all .3s; }',
        '.topic-item:hover { background-color: #f8f9fa; border-radius: 5px; transition: all .5s; }',
        '.topic-item-link { color: inherit; text-decoration: none; outline : none; }'
    ],
    template: `
        <header *ngIf="!category" class="text-center bg-success text-white p-4">
            <h2>Forum</h2>
        </header>

        <header *ngIf="category" class="text-center bg-success text-white p-4">
            <h2>{{ category.name }}</h2>
            <p>{{ category.description }}</p>
        </header>

        <section role="main" class="container">
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
                            <i class="fa" [class.fa-square]="!category.parent" [class.fa-square-o]="category.parent"></i> {{ category.name }}
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

                                    <h5 class="m-0">
                                        <small>
                                            <i *ngIf="topic.metadata.blocked" title="Topic fermé" class="fa fa-lock"></i>
                                            <i *ngIf="topic.metadata.pinned" title="Topic épinglé" class="fa fa-thumb-tack"></i>
                                        </small>
                                        {{ topic.title }}
                                    </h5>
                                    <small>{{ topic.created_at | date }}</small>

                                </div>
                            </article>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    `,
    inject: [Repository, CommonUtils, ng.router.ActivatedRoute]
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
        this.queryId = null;
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            let categoriesParams = {};
            let topicsParams = { type: 'topic' };

            if (!!params.id) {
                categoriesParams = { parent: params.id };
                topicsParams = { target: { type: 'category', id: params.id }, type: 'topic' };

                this.repository.query('forum:categories:get', { id: params.id }, query => {
                    this.category = query.result;
                });
            }

            this.repository.query('forum:categories:find', categoriesParams, query => {
                this.subcategories = query.result;
            });

            if (this.sort === 'newest') {
                topicsParams.sort = { 'metadata.pinned': -1, created_at: -1, edited_at: -1 };
            }

            if (this.sort === 'latest') {
                topicsParams.sort = { 'metadata.pinned': -1, edited_at: -1, created_at: -1 };
            }

            if (this.sort === 'oldest') {
                topicsParams.sort = { 'metadata.pinned': -1, edited_at: 1, created_at: 1 };
            }

            this.queryId = this.repository.subscribe('messages:find', topicsParams, query => {
                this.topics = query.result;
            });
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
        this.repository.unsubscribe(this.queryId);
    }

    onChange() {
        this.ngOnInit();
    }
}
