import { Component } from 'angular-js-proxy';

import { Repository } from './../../../modules/common';

@Component({
    selector: 'topic-comments-counter-component',
    inputs: ['id'],
    template: `
        <i class="fa fa-comments"></i> {{ count }}
    `,
    providers: [Repository]
})
export class TopicCommentsCounterComponent {
    constructor(repository) {
        this.repository = repository;

        this.count = 0;
    }

    ngOnInit() {
        const params = { target: { type: 'topic', id: String(this.id) } };
        this.repository.query('count-messages', params, (query) => {
            this.count = query.result;
        });
    }

    ngOnDestroy() {
        this.repository.clear();
    }
}
