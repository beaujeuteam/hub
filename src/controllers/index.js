const ForumController = require('./forum');
const StreamsController = require('./streams');
const GamesController = require('./games');

module.exports = (server) => {

    const forumCtrl = new ForumController();
    const streamsCtrl = new StreamsController();
    const gamesCtrl = new GamesController();

    server.addValidator('forum:categories:find', require('./../../config/schemas/find-categories.json'));
    server.addValidator('forum:categories:get', require('./../../config/schemas/find-category.json'));
    server.addValidator('forum:topics:pin', require('./../../config/schemas/pin-topic.json'), ['beaujeuteam:topics:pin']);
    server.addValidator('forum:topics:block', require('./../../config/schemas/block-topic.json'), ['beaujeuteam:topics:block']);

    /*server.addValidator('streams:get', require('./../../config/schemas/get-stream.json'));
    server.addValidator('streams:update', require('./../../config/schemas/update-stream.json'));
    server.addValidator('streams:play', require('./../../config/schemas/play-stream.json'));
    server.addValidator('streams:stop', require('./../../config/schemas/stop-stream.json'));
    server.addValidator('streams:key:generate', require('./../../config/schemas/stream-generate-key.json'));*/

    server.addValidator('games:insert', require('./../../config/schemas/insert-game.json'));
    server.addValidator('games:search', require('./../../config/schemas/search-game.json'));
    server.addValidator('games:search-one', require('./../../config/schemas/search-one-game.json'));
    server.addValidator('games:get', require('./../../config/schemas/get-game.json'));
    server.addValidator('games:users:insert', require('./../../config/schemas/insert-user.json'));
    server.addValidator('games:users:delete', require('./../../config/schemas/delete-user.json'));
    server.addValidator('games:users-to-play:insert', require('./../../config/schemas/insert-user-play.json'));
    server.addValidator('games:users-to-play:delete', require('./../../config/schemas/delete-user-play.json'));
    server.addValidator('games:users-to-own:insert', require('./../../config/schemas/insert-user-own.json'));
    server.addValidator('games:users-to-own:delete', require('./../../config/schemas/delete-user-own.json'));

    server.on('forum:categories:find', (event, server) => forumCtrl.findCategories(event, server));
    server.on('forum:categories:get', (event, server) => forumCtrl.findCategory(event, server));
    server.on('forum:topics:pin', (event, server) => forumCtrl.pinTopic(event, server));
    server.on('forum:topics:block', (event, server) => forumCtrl.blockTopic(event, server));

    /*server.on('streams:get', (event, server) => streamsCtrl.get(event, server));
    server.on('streams:find', (event, server) => streamsCtrl.find(event, server));
    server.on('streams:update', (event, server) => streamsCtrl.update(event, server));
    server.on('streams:play', (event, server) => streamsCtrl.play(event, server));
    server.on('streams:stop', (event, server) => streamsCtrl.stop(event, server));
    server.on('streams:key:generate', (event, server) => streamsCtrl.generateKey(event, server));*/

    server.on('games:insert', (event, server) => gamesCtrl.insert(event, server));
    server.on('games:search', (event, server) => gamesCtrl.search(event, server));
    server.on('games:search-one', (event, server) => gamesCtrl.searchOne(event, server));
    server.on('games:get', (event, server) => gamesCtrl.get(event, server));
    server.on('games:find', (event, server) => gamesCtrl.find(event, server));
    server.on('games:users:insert', (event, server) => gamesCtrl.insertUser(event, server));
    server.on('games:users:delete', (event, server) => gamesCtrl.deleteUser(event, server));
    server.on('games:users-to-play:insert', (event, server) => gamesCtrl.insertUserToPlay(event, server));
    server.on('games:users-to-play:delete', (event, server) => gamesCtrl.deleteUserToPlay(event, server));
    server.on('games:users-to-own:insert', (event, server) => gamesCtrl.insertUserToOwn(event, server));
    server.on('games:users-to-own:delete', (event, server) => gamesCtrl.deleteUserToOwn(event, server));

    server.on('users:games:find', (event, server) => gamesCtrl.findByUser(event, server));

    server.on('messages:insert', (event, server) => {
        const { data } = event;

        if (!!data.target && data.type === 'topic') {
            server.query({
                type: 'update',
                collection: 'messages',
                selector: { id: data.target.id },
                params: { $set: { edited_at: new Date() } }
            });
        }
    })
};
