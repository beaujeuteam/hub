import { Component, core } from 'angular-js-proxy';

import { Repository } from './../../../modules/common';
import { CommonUtils } from './../../../modules/common';

@Component({
    template: `
        <header class="text-center bg-light p-4">
            <h2>Nouveau topic</h2>
            <span *ngIf="!!category">{{ category.name }}</span>
        </header>

        <section class="container">
            <section *ngIf="!!category">
                <form (submit)="onSubmit($event)">
                    <div class="group-form">
                        <label for="title">Titre</label>
                        <input id="title" [(ngModel)]="data.title" class="form-control" type="text" name="title" required="required">
                    </div>

                    <div class="group-form mt-4">
                        <social-markdown-editor-component (onChange)="onEditorChange($event)" [placeholder]="'Contenu du topic'"></social-markdown-editor-component>
                    </div>

                    <button type="submit" class="btn btn-success" [disabled]="!isValidate() || loading">
                        Envoyer <i *ngIf="loading" class="fa fa-spin fa-spinner"></i>
                    </button>
                </form>
            </section>
        </section>
    `,
    providers: [Repository, CommonUtils]
})
export class WriteTopicComponent {
    constructor(repository, utils, ActivatedRoute, Router) {
        this.repository = repository;
        this.utils = utils;
        this.route = ActivatedRoute;
        this.router = Router;

        this.loading = false;
        this.category = null;
        this.sub = null;
        this.data = {
            title: null,
            content: null,
            tags: [],
            mentions: [],
            mimetype: 'markdown',
            type: 'topic',
            target: { type: 'category', id: null }
        }
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            if (!!params.id) {
                this.repository.query('find-category', { id: params.id }, query => {
                    this.category = query.result;
                    this.data.target.id = this.category._id;
                });
            }
        });
    }

    ngOnDestroy() {
        this.repository.clear();
    }

    onEditorChange(event) {
        this.data.content = event.content;
        this.data.tags = event.tags;
        this.data.mentions = event.mentions;
    }

    onSubmit(event) {
        event.preventDefault();

        if (!this.isValidate()) {
            return;
        }

        this.loading = false;
        this.repository.query('insert-message', this.data, query => {
            const topic = query.result.ops[0];
            this.router.navigate(['/forum/topic', topic._id, this.utils.stringToURL(topic.title)]);
            this.loading = true;
        });
    }

    isValidate() {
        return !!this.data.title && !!this.data.content;
    }
}
