const { createApp, createServer } = require('yion');
const { createMegaqueryServer } = require('yion-megaquery');
const pug = require('yion-pug');

const { version, name } = require('./package.json');
const env = process.env.NODE_ENV || 'dev';
const parameters = require('./config/config.json')[env];
const db = parameters.db;
const config = Object.assign({ version, name, env }, parameters.modules);

const app = createApp();
const httpServer = createServer(app, [pug]);
const socketServer = createMegaqueryServer(httpServer, app, db);
const port = process.env.NODE_PORT || 8080;
const cache = {
    'Cache-Control': 'public, max-age=' + (86400 * 30),
    'ETag': Date.now()
};

// validate cache
app.use((req, res, next) => {
    if (req.headers['if-none-match'] && req.headers['if-none-match'] == cache['ETag']) {
        return res.status(304).send();
    }

    next();
});

app.link('/modules', __dirname + '/node_modules', cache);
app.link('/dist', __dirname + '/dist', cache);
app.link('/styles', __dirname + '/public/styles');
app.link('/images', __dirname + '/public/images', cache);
app.link('/js', __dirname + '/public/js', cache);

require('./src/controllers')(socketServer);
require('pxl-angular-social/src/controller')(socketServer, { application: 'beaujeuteam' });

app.get('/', (req, res) => {
    res.render(__dirname + '/public/views/index.pug', { config });
});

app.get('/app', (req, res) => {
    const fs = require('fs');
    const src = fs.createReadStream(__dirname + '/dist/app.js');

    res.set('Content-Type', 'application/javascript');
    res.set('Cache-Control', cache['Cache-Control']);
    res.set('ETag', cache['ETag']);

    src.pipe(res.original);
});

httpServer.listen(port);
httpServer.on('listening', () => console.log(`🌏  Server start on port ${port}`));
