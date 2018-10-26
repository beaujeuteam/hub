import { StreamsRepository } from './../../services/streams';

@Component({
    inputs: ['streamId'],
    selector: 'stream-viewers-counter-component',
    template: `
        <span *ngIf="stream"><i class="fa fa-eye"></i> {{ stream.viewers }}</span>
    `,
    inject: [StreamsRepository]
})
export class StreamViewersCounterComponent {
    constructor(repository) {
        this.streamId = null;
        this.repository = repository;

        this.queryId = null;
        this.stream = null;
    }

    ngOnInit() {
        this.repository.query('streams:viewers:add', { streamId: this.streamId });
        this.queryId = this.repository.subscribe('streams:get', { streamId: this.streamId }, query => {
            this.stream = query.result;
        });
    }

    ngOnDestroy() {
        this.repository.query('streams:viewers:remove', { streamId: this.streamId });
    }
}
