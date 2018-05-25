const { createApp, createServer } = require('yion');
const { createSocketServer } = require('yion-mongodb-socket');
const pug = require('yion-pug');

const { version, name } = require('./package.json');
const env = process.env.NODE_ENV || 'dev';
const parameters = require('./config/config.json')[env];
const db = parameters.db;
const config = Object.assign({ version, name, env }, parameters.modules);

const app = createApp();
const httpServer = createServer(app, [pug]);
const socketServer = createSocketServer(app, httpServer, db);
const port = process.env.NODE_PORT || 8080;

app.link('/modules', __dirname + '/node_modules');
app.link('/dist', __dirname + '/dist');
app.link('/styles', __dirname + '/public/styles');
app.link('/images', __dirname + '/public/images');
app.link('/js', __dirname + '/public/js');

require('./src/controllers/forum')(socketServer);
require('./modules/social/controller')(socketServer, { messages: { application: 'beaujeuteam'} });

app.get('/', (req, res) => {
    res.render(__dirname + '/public/views/index.pug', { config });
});

httpServer.listen(port);
httpServer.on('listening', () => console.log(`🌏  Server start on port ${port}`));
