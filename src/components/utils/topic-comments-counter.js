import { Repository } from 'pxl-angular-common';

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
        this.queryId = null;
    }

    ngOnInit() {
        const params = { target: { type: 'topic', id: String(this.id) } };
        this.queryId = this.repository.subscribe('messages:count', params, (query) => {
            this.count = query.result;
        });
    }

    ngOnDestroy() {
        this.repository.unsubscribe(this.queryId);
    }
}
