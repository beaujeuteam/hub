const MongoObjectID = require("mongodb").ObjectID;

module.exports = (server) => {
    server.on('find-categories', (event) => {
        const { data } = event;
        const params = { parent: !!data.params.parent ? new MongoObjectID(data.params.parent) : null };

        server.query(event, {
            type: 'find',
            collection: 'beaujeuteam_categories',
            params,
            sort: { order: 1 }
        });
    });

    server.on('find-category', (event) => {
        const { data } = event;

        if (!data.params.id) {
            return server.abort(event, 'Find category need "id" parameter.');
        }

        server.query(event, {
            type: 'findOne',
            collection: 'beaujeuteam_categories',
            params: { id: data.params.id }
        });
    });

    server.on('insert-message', (event) => {
        const { data } = event;

        if (data.params.target.type === 'topic') {
            server.requester.query({
                type: 'update',
                collection: 'messages',
                selector: { id: data.params.target.id },
                params: { $set: { edited_at: new Date() } }
            });
        }
    });
};
