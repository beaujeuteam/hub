import { Repository, CommonUtils } from 'pxl-angular-common';

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
    inject: [Repository, CommonUtils]
})
export class CategoryLabelComponent {
    constructor(repository, utils) {
        this.repository = repository;
        this.utils = utils;

        this.category = null;
        this.query = null;
    }

    ngOnInit() {
        this.repository.query('forum:categories:get', { id: this.id }, (query) => {
            this.category = query.result;
        });
    }
}
