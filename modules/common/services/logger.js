import boxstore from 'boxstore';

export class Logger {
    debug(message, data = null) {
        if (boxstore.get('env') != 'production' || !!boxstore.get('debug')) {
            const date = new Date();
            console.log(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} [DEBUG] ${message}`, data);
        }
    }

    info(message, data = null) {
        if (boxstore.get('env') != 'production' || !!boxstore.get('debug')) {
            const date = new Date();
            console.log(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} [INFO] ${message}`, data);
        }
    }

    error(message, data = null) {
        if (boxstore.get('env') != 'production' || !!boxstore.get('debug')) {
            const date = new Date();
            console.error(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} [ERROR] ${message}`, data);
        }
    }
}
