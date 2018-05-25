import { Injectable } from 'angular-js-proxy';

import { Client as BaseClient } from 'yion-mongodb-socket/client';

@Injectable()
export class Client extends BaseClient {
    constructor() {
        super();
    }
}
