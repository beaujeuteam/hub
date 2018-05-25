const MongoObjectID = require("mongodb").ObjectID;

module.exports = (server, defaultParams = {}) => {
    const messagesDefaultParams = !!defaultParams.messages ? defaultParams.messages : {};
    const createFindQueryHeader = (data) => {
        const header = {
            type: 'find',
            collection: 'messages'
        };

        const params = {
            visibility: 'public'
        };

        if (!!data.params.target) {
            params.target = data.params.target;
        }

        if (!!data.params.type) {
            params.type = data.params.type;
        }

        if (!!data.params.sort) {
            header.sort = data.params.sort;
        }

        if (!!data.params.limit) {
            header.limit = data.params.limit;
        }

        header.params = Object.assign(params, messagesDefaultParams);

        return header;
    };

    server.on('find-message', (event) => {
        const { data } = event;

        if (!data.params.id) {
            return server.abort(event, 'Find message need "id" parameter.');
        }

        const params = {
            id: data.params.id,
            visibility: 'public'
         };

        server.query(event, {
            type: 'findOne',
            collection: 'messages',
            params: Object.assign(params, messagesDefaultParams)
        });
    });

    server.on('find-messages', (event) => {
        const { data } = event;

        server.query(event, createFindQueryHeader(data));
    });

    server.on('count-messages', (event) => {
        const { data } = event;
        const params = {
            visibility: 'public'
        };

        if (!!data.params.target) {
            params.target = data.params.target;
        }

        server.query(event, {
            type: 'count',
            collection: 'messages',
            params: Object.assign(params, messagesDefaultParams)
        });
    });

    server.on('insert-message', (event) => {
        const { data, client } = event;

        if (!client.token) {
            return server.abort(event, 'Not authenticated.');
        }

        if (!data.params.content) {
            return server.abort(event, 'Insert message need "content" parameter.');
        }

        const params = {
            user: client.token.payload.sub,
            application: client.token.payload.aud,
            title: data.params.title || null,
            content: data.params.content,
            type: data.params.type || 'message',
            tags: data.params.tags || [],
            mentions: data.params.mentions || [],
            attachments: data.params.attachments || [],
            target: data.params.target || null,
            visibility: data.params.visibility || 'public',
            mimetype: data.params.mimetype || 'text',
            created_at: new Date(),
            edited_at: null
        };

        server.query(event, {
            type: 'insert',
            collection: 'messages',
            params
        });
    });

    server.on('update-message', (event) => {
        const { data, client } = event;

        if (!client.token) {
            return server.abort(event, 'Not authenticated.');
        }

        server.requester.query({
            type: 'findOne',
            collection: 'messages',
            params: {
                user: client.token.payload.sub,
                id: data.params.id
            }
        }).then(query => {
            if (!!query.result) {
                const params = {
                    title: data.params.title || query.result.title,
                    content: data.params.content || query.result.content,
                    tags: data.params.tags || query.result.tags,
                    mentions: data.params.mentions || query.result.mentions,
                    attachments: data.params.attachments || query.result.attachments,
                    edited_at: new Date()
                };

                return server.query(event, {
                    type: 'update',
                    collection: 'messages',
                    selector: { id: query.result._id },
                    params: { $set: params }
                });
            }

            server.abort(event, 'Document not found.');
        });
    });

    server.on('remove-message', (event) => {
        const { data, client } = event;

        if (!client.token) {
            return server.abort(event, 'Not authenticated.');
        }

        server.requester.query({
            type: 'findOne',
            collection: 'messages',
            params: {
                user: client.token.payload.sub,
                id: data.params.id
            }
        }).then(query => {
            if (!!query.result) {
                server.requester.query({
                    type: 'remove',
                    collection: 'messages',
                    selector: {
                        target: {
                            type: query.result.type,
                            id: String(data.params.id)
                        }
                    }
                });

                return server.query(event, {
                    type: 'remove',
                    collection: 'messages',
                    selector: { id: query.result._id }
                });
            }

            server.abort(event, 'Document not found.');
        });
    });

    server.on('search-tags', (event) => {
        const { data, client } = event;

        const params = { tags: { $regex: data.params.search || '', $options: 'i' } };

        server.query(event, {
            type: 'distinct',
            collection: 'messages',
            field: 'tags',
            params
        })
    });
};
