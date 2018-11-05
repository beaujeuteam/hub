const uuid = require('uuid/v4');

class Hooker {
    constructor(socketServer) {
        this.socketServer = socketServer;

        this.socketServer.on('hooker:subscribe', (event, server) => {
            const { client } = event;
            client.subscribe = uuid();
        });
    }

    dispatch(name, data) {
        Array.from(this.socketServer.clients)
            .filter(client => !!client.subscribe)
            .forEach(client => client.send(JSON.stringify({ name, data })));
    }
}

module.exports = Hooker;
