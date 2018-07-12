const igdb = require('igdb-api-node').default;

class GamesController {
    constructor() {
        // https://api-endpoint.igdb.com
        this.igdbClient = igdb('afcd483edfcae4db8122fc8ae5d38fc1');
    }

    insert(event, server) {
        const { data } = event;
        const params = {
            cover: null,
            created_at: new Date(),
            edited_at: null
        };

        if (!!data.imageId) {
            params.cover = {
                small: `//images.igdb.com/igdb/image/upload/t_thumb/${data.imageId}.jpg`,
                big: `//images.igdb.com/igdb/image/upload/t_cover_big/${data.imageId}.jpg`
            };

            delete data.imageId;
        }

        server.query({
            type: 'findOne',
            collection: 'beaujeuteam_games',
            params: { gameId: data.gameId }
        }).then(query => {
            const game = query.result || {};
            server.query({
                type: 'update',
                collection: 'beaujeuteam_games',
                params: Object.assign(game, params, data),
                selector: { gameId: data.gameId },
                options: {
                    upsert: true
                }
            }, event);
        });
    }

    search(event, server) {
        const { data, client } = event;
        const query = { id: event.queryId, result: [] };

        const params = {
            fields: '*',
            search: data.search,
            limit: data.limit,
            filters: {
                'category-eq': 0,
                'game_modes-in': '2'
            }
        };

        this.igdbClient.games(params).then(response => {
            query.result = response.body;
            server.sendQueryToClient(query, client);
        });
    }

    searchOne(event, server) {
        const { data, client } = event;
        const query = { id: event.queryId, result: [] };

        const params = { fields: '*', ids: [data.gameId] };

        this.igdbClient.games(params).then(response => {
            query.result = response.body[0];
            server.sendQueryToClient(query, client);
        });
    }

    find(event, server) {
        const { data } = event;
        const params = {
            cover: { $ne: null },
            users: { $ne: [] }
        };

        server.query({
            type: 'find',
            collection: 'beaujeuteam_games',
            params,
            sort: { edited_at: -1, created_at: -1 }
        }, event);
    }

    get(event, server) {
        const { data } = event;

        server.query({
            type: 'findOne',
            collection: 'beaujeuteam_games',
            params: { id: data.id }
        }, event);
    }

    insertUser(event, server) {
        const { data, client } = event;

        if (!client.token) {
            return server.abort(event, 'Not authenticated.');
        }

        if (!data.id && !data.gameId) {
            return server.abort(event, 'Update game users need "id" or "gameId" parameter.');
        }

        server.query({
            type: 'findOne',
            collection: 'beaujeuteam_games',
            params: data
        }).then(query => {
            if (!!query.result) {
                const username = client.token.payload.sub;
                const params = {
                    users: !!query.result.users ? query.result.users.filter(u => u !== username).concat([username]) : [username],
                    edited_at: new Date()
                };

                return server.query({
                    type: 'update',
                    collection: 'beaujeuteam_games',
                    selector: { id: query.result._id },
                    params: { $set: params }
                }, event);
            }

            server.abort(event, 'Document not found.');
        });
    }

    deleteUser(event, server) {
        const { data, client } = event;
        const params = {};

        if (!client.token) {
            return server.abort(event, 'Not authenticated.');
        }

        if (!data.id && !data.gameId) {
            return server.abort(event, 'Update game users need "id" or "gameId" parameter.');
        }

        server.query({
            type: 'findOne',
            collection: 'beaujeuteam_games',
            params: data
        }).then(query => {
            if (!!query.result) {
                const username = client.token.payload.sub;
                const params = {
                    users: !!query.result.users ? query.result.users.filter(u => u !== username) : [],
                    edited_at: new Date()
                };

                return server.query({
                    type: 'update',
                    collection: 'beaujeuteam_games',
                    selector: { id: query.result._id },
                    params: { $set: params }
                }, event);
            }

            server.abort(event, 'Document not found.');
        });
    }

    insertUserToPlay(event, server) {
        const { data, client } = event;

        if (!client.token) {
            return server.abort(event, 'Not authenticated.');
        }

        server.query({
            type: 'findOne',
            collection: 'beaujeuteam_games',
            params: { id: data.id }
        }).then(query => {
            if (!!query.result) {
                const username = client.token.payload.sub;
                const params = {
                    users_to_play: !!query.result.users_to_play ? query.result.users_to_play.filter(u => u !== username).concat([username]) : [username],
                    edited_at: new Date()
                };

                return server.query({
                    type: 'update',
                    collection: 'beaujeuteam_games',
                    selector: { id: query.result._id },
                    params: { $set: params }
                }, event);
            }

            server.abort(event, 'Document not found.');
        });
    }

    deleteUserToPlay(event, server) {
        const { data, client } = event;

        if (!client.token) {
            return server.abort(event, 'Not authenticated.');
        }

        server.query({
            type: 'findOne',
            collection: 'beaujeuteam_games',
            params: { id: data.id }
        }).then(query => {
            if (!!query.result) {
                const username = client.token.payload.sub;
                const params = {
                    users_to_play: !!query.result.users_to_play ? query.result.users_to_play.filter(u => u !== username) : [],
                    edited_at: new Date()
                };

                return server.query({
                    type: 'update',
                    collection: 'beaujeuteam_games',
                    selector: { id: query.result._id },
                    params: { $set: params }
                }, event);
            }

            server.abort(event, 'Document not found.');
        });
    }

    insertUserToOwn(event, server) {
        const { data, client } = event;

        if (!client.token) {
            return server.abort(event, 'Not authenticated.');
        }

        server.query({
            type: 'findOne',
            collection: 'beaujeuteam_games',
            params: { id: data.id }
        }).then(query => {
            if (!!query.result) {
                const username = client.token.payload.sub;
                const params = {
                    users_to_own: !!query.result.users_to_own ? query.result.users_to_own.filter(u => u !== username).concat([username]) : [username],
                    edited_at: new Date()
                };

                return server.query({
                    type: 'update',
                    collection: 'beaujeuteam_games',
                    selector: { id: query.result._id },
                    params: { $set: params }
                }, event);
            }

            server.abort(event, 'Document not found.');
        });
    }

    deleteUserToOwn(event, server) {
        const { data, client } = event;

        if (!client.token) {
            return server.abort(event, 'Not authenticated.');
        }

        server.query({
            type: 'findOne',
            collection: 'beaujeuteam_games',
            params: { id: data.id }
        }).then(query => {
            if (!!query.result) {
                const username = client.token.payload.sub;
                const params = {
                    users_to_own: !!query.result.users_to_own ? query.result.users_to_own.filter(u => u !== username) : [],
                    edited_at: new Date()
                };

                return server.query({
                    type: 'update',
                    collection: 'beaujeuteam_games',
                    selector: { id: query.result._id },
                    params: { $set: params }
                }, event);
            }

            server.abort(event, 'Document not found.');
        });
    }

    findByUser(event, server) {
        const { client } = event;

        if (!client.token) {
            return server.abort(event, 'Not authenticated.');
        }

        server.query({
            type: 'find',
            collection: 'beaujeuteam_games',
            params: { users: { $in: [client.token.payload.sub] } },
            sort: { created_at: -1 }
        }, event);
    }
}

module.exports = GamesController;
