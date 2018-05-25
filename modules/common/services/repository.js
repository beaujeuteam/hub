import { Injectable } from 'angular-js-proxy';
import boxstore from 'boxstore';

import { Repository as BaseRepository } from 'yion-mongodb-socket/client';

import { Client } from './client';

@Injectable({
    providers: [Client]
})
export class Repository extends BaseRepository {
    constructor(client) {
        super(client);
    }

    query(name, params = {}, callback = null) {
        const logger = boxstore.get('logger');
        logger.debug(`<Repository> call query named "${name}"`, params);

        return super.query(name, params, (query) => {
            logger.debug(`<Repository> get response from query named "${name}"`, query);

            if (!!query.error) {
                throw new Error(`${query.name} : ${query.error}`);
            }

            callback(query);
        });
    }
}
