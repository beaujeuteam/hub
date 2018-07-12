const uuid = require('uuid');

class StreamsController {
    find(event, server) {
        const { data } = event;
        const params = { alive: true };

        server.query({
            type: 'find',
            collection: 'beaujeuteam_streams',
            params,
            sort: { created_at: -1 }
        }, event);
    }

    get(event, server) {
        const { data, client } = event;
        const params = {};

        if (!!data.streamId) {
            params.streamId = data.streamId;
        } else if (!!data.user && !!client.token && client.token.payload.sub == data.user) {
            params.user = data.user;
        } else if (!!data.key) {
            params.key = data.key;
        } else if (!!data.id) {
            params.id = data.id;
        } else {
            return server.abort(event, 'Update stream need "streamId", "user", "key" or "id" parameter.');
        }

        server.query({
            type: 'findOne',
            collection: 'beaujeuteam_streams',
            noSynchronize: true,
            params
        }, event);
    }

    generateKey(event, server) {
        const { data, client } = event;

        if (!client.token) {
            return server.abort(event, 'Not authenticated.');
        }

        if (client.token.payload.sub != data.user) {
            return server.abort(event, 'Not authorized.');
        }

        const params = {
            key: uuid.v4(),
            user: client.token.payload.sub,
            streamId: null,
            title: null,
            poster: null,
            width: 0,
            height: 0,
            fps: 0,
            viewers: 0,
            created_at: null,
            alive: false,
        };

        server.query({
            type: 'update',
            collection: 'beaujeuteam_streams',
            selector: { user: data.user },
            params,
            options: { upsert: true }
        }, event);
    }

    play(event, server) {
        const { data } = event;
        const selector = { key: data.key };
        const params = { created_at: new Date(), alive: true };

        server.query({
            type: 'update',
            collection: 'beaujeuteam_streams',
            selector,
            params: { $set: Object.assign(params, data) }
        }, event);
    }

    stop(event, server) {
        const { data } = event;
        const selector = {
            streamId: data.streamId
        };
        const params = {
            $set: { alive: false, created_at: null, viewers: 0 }
        };

        server.query({
            type: 'update',
            collection: 'beaujeuteam_streams',
            selector,
            params
        }, event);
    }

    update(event, server) {
        const { data } = event;
        const selector = {};

        if (!!data.key) {
            selector.key = data.key;
        } else if (!!data.streamId) {
            selector.streamId = data.streamId;
        } else {
            return server.abort(event, 'Update stream need "key" or "streamId" parameter.');
        }

        server.query({
            type: 'update',
            collection: 'beaujeuteam_streams',
            noSynchronize: true,
            selector,
            params: { $set: data }
        }, event);
    }
}

module.exports = StreamsController;
