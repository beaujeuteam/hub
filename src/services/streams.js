import boxstore from 'boxstore';

import { Client, Repository } from 'pxl-angular-common';

@Injectable()
export class StreamsRepository {
    constructor() {
        this.client = new Client();
        this.repository = new Repository(this.client);

        this.client.connect(boxstore.get('stream.url'));
    }

    query(name, params = {}, callback = null) {
        return this.repository.query(name, params, callback);
    }

    subscribe(name, params = {}, callback = null) {
        return this.repository.subscribe(name, params, callback);
    }

    unsubscribe(queryId) {
        return this.repository.unsubscribe(queryId);
    }
}
