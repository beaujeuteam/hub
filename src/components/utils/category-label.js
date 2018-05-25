import { Component } from 'angular-js-proxy';

import { Repository, CommonUtils } from './../../../modules/common';

@Component({
    selector: 'category-label-component',
    inputs: ['id'],
    template: `
        <a *ngIf="category"
            [routerLink]="['/forum/category', category._id, utils.stringToURL(category.name)]"
            class="badge badge-secondary"
        >
            {{ category.name }}
        </a>
    `,
    providers: [Repository, CommonUtils]
})
export class CategoryLabelComponent {
    constructor(repository, utils) {
        this.repository = repository;
        this.utils = utils;

        this.category = null;
    }

    ngOnInit() {
        this.repository.query('find-category', { id: this.id }, (query) => {
            this.category = query.result;
        });
    }

    ngOnDestroy() {
        this.repository.clear();
    }
}
