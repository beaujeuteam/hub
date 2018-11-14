import { Repository, CommonUtils } from 'pxl-angular-common';
import { UsersRepository } from 'pxl-angular-auth';

@Component({
    styles: [
        '.item-link { color: inherit; text-decoration: none; outline : none; }'
    ],
    template: `
        <section role="main" class="container">
            <common-search-bar-component
                *ngIf="context"
                [options]="options"
                [contexts]="contexts"
                [context]="context"
                (refresh)="onChange($event)">
            </common-search-bar-component>

            <h3 class="mt-4">{{ context.label }}</h3>

            <p *ngIf="items.length === 0" class="alert alert-info">
                Oops ! Il n'y a rien à afficher ¯\\_(ツ)_/¯
            </p>

            <section *ngIf="context === contexts[0]">
                <div class="card-columns">
                    <a *ngFor="let topic of items"
                        class="item-link"
                        [routerLink]="['/forum/topic', topic._id, utils.stringToURL(topic.title)]"
                    >
                        <div class="mb-4">
                            <social-message-card-component
                                [id]="topic._id"
                                [limit]="200"
                                [displayFooter]="false">
                            </social-message-card-component>
                        </div>
                    </a>
                </div>
            </section>

            <section *ngIf="context === contexts[1]">
                <div class="card-columns">
                    <div *ngFor="let message of items" class="mb-4">
                        <social-message-card-component [id]="message._id"></social-message-card-component>
                    </div>
                </div>
            </section>

            <section *ngIf="context === contexts[2]">
                <div class="card-columns">
                    <div *ngFor="let game of items">
                        <a class="item-link" [routerLink]="['/community/game', game._id, utils.stringToURL(game.name)]">
                            <article class="card">
                                <img class="card-img-top" [src]="game.cover.big" [alt]="game.name" [title]="game.name">
                                <div class="card-body">
                                    <h5 class="card-title">{{ game.name }}</h5>
                                </div>
                            </article>
                        </a>
                    </div>
                </div>
            </section>
        </section>
    `,
    inject: [Repository, UsersRepository, CommonUtils, ng.router.ActivatedRoute]
})
export class SearchComponent {
    constructor(repository, users, utils, route) {
        this.repository = repository;
        this.users = users;
        this.utils = utils;
        this.route = route;

        this.contexts = [
            { label: 'Topics', key: 'topics' },
            { label: 'Messages', key: 'messages' },
            //{ label: 'Jeux', key: 'games' }
        ];

        this.contextOptions = [
            {
                tokens: [
                    { name: 'Categorie', key: 'caterogy', callback: () => this.getCategories() }
                ],
                placeholder: 'Recherche de topics'
            },
            {
                tokens: [
                    { name: 'Tags', key: 'tags', values: [], callback: (term) => this.getTags(term) },
                    { name: 'Utilisateur', key: 'user', values: [], callback: (term) => this.getUsers(term) }
                ],
                placeholder: 'Recherche de messages'
            },
            { tokens: [] }
        ];

        this.options = null;
        this.context = null;
        this.sub = null;
        this.items = [];
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe((params) => {
            if (!!params['context']) {
                const context = this.contexts.find(c => c.key == params['context']);
                this.onChange({ context, tokens: [] });
            } else {
                this.onChange({ context: this.contexts[0], tokens: [] });
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    onChange({ search, context, tokens }) {
        if (context !== this.context) {
            this.context = context;

            switch (this.context) {
                case this.contexts[0]:
                    this.options = this.contextOptions[0];
                    break;
                case this.contexts[1]:
                    this.options = this.contextOptions[1];
                    break;
                default:
                    this.options = this.contextOptions[2];
            }
        }

        this.search(search, context, tokens);
    }

    getUsers(term = '') {
        return this.users.search(term)
            .then(users => users.map(u => ({ key: u.identifier, label: `@${u.identifier}`})));
    }

    getTags(search = '') {
        return new Promise((resolve, reject) => {
            this.repository.query('messages:tags:search', { search: search || '' }, query => {
                resolve(query.result.map(t => ({ key: t, label: `#${t}`})));
            });
        });
    }

    getCategories() {
        return new Promise((resolve, reject) => {
            this.repository.query('forum:categories:find', {}, query => {
                resolve(query.result.map(c => ({ key: c._id, label: c.name })));
            });
        });
    }

    search(search, context, tokens) {
        const params = {};

        tokens.forEach(token => params[token.key] = typeof token.value !== 'object' ? token.value : token.value.key);

        switch (context) {
            case this.contexts[0]:
                this.searchTopics(search, params);
                break;
            case this.contexts[1]:
                this.searchCommunityMessages(search, params);
                break;
            case this.contexts[2]:
                this.searchCommunityGames(search);
                break;
            case this.contexts[3]:
                //this.searchCommunityStreams(search);
                break;
            default:
                this.items = [];
        }
    }

    searchTopics(search, params) {
        if (!!search) {
            params.content = { $regex: search, $options: 'i' }
        }

        if (params.caterogy) {
            params.target = { id: params.caterogy, type: 'category' };
        }

        params.type = 'topic';

        this.repository.query('messages:find', params, query => this.items = query.result);
    }

    searchCommunityMessages(search, params) {
        if (!!search) {
            params.content = { $regex: search, $options: 'i' }
        }

        params.type = 'community-message';

        this.repository.query('messages:find', params, query => this.items = query.result);
    }

    searchCommunityGames(search) {
        this.repository.query('games:find', {}, query => this.items = query.result);
    }
}
