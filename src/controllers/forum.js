
class ForumController {

    findCategories(event, server) {
        const { data } = event;
        const params = { parent: data.parent || null };

        server.query({
            type: 'find',
            collection: 'beaujeuteam_categories',
            params,
            sort: { order: 1 }
        }, event);
    }

    findCategory(event, server) {
        const { data } = event;

        server.query({
            type: 'findOne',
            collection: 'beaujeuteam_categories',
            params: { id: data.id }
        }, event);
    }

    pinTopic(event, server) {

        const { data } = event;

        server.query({
            type: 'findOne',
            collection: 'messages',
            params: { type: 'topic', id: data.id }
        }).then(({ result }) => {
            if (result) {
                return server.query({
                    type: 'update',
                    collection: 'messages',
                    selector: { id: result._id },
                    params: { $set: { 'metadata.pinned': !result.metadata.pinned } }
                }, event);
            }

            server.abort(event, 'Document not found.');
        });
    }

    blockTopic(event, server) {
        const { data } = event;

        server.query({
            type: 'findOne',
            collection: 'messages',
            params: { type: 'topic', id: data.id }
        }).then(({ result }) => {
            if (result) {
                return server.query({
                    type: 'update',
                    collection: 'messages',
                    selector: { id: result._id },
                    params: { $set: { 'metadata.blocked': !result.metadata.blocked } }
                }, event);
            }

            server.abort(event, 'Document not found.');
        });
    }
}

module.exports = ForumController;
