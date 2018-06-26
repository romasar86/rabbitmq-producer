const amqp = require("amqplib");

let channel = null;

class Amqp {
    constructor(options) {
        this.options = options;
    }

    get channel() {
        return channel;
    }

    set channel(ch) {
        channel = ch;
    }

    createConnection() {
        return amqp.connect(`amqp://${this.options.host}:${this.options.port}`);
    }

    createChannel(connection) {
        return connection.createChannel();
    }

    storeChannel(ch) {
        return this.channel = ch;
    }

    connect() {
        if(this.channel) return Promise.resolve(this.channel);
        return this.createConnection()
            .then(this.createChannel.bind(this))
            .then(this.storeChannel.bind(this));
    }

    send(queueName, data) {
        return this.connect().then(ch => {
            ch.assertQueue(queueName);
            return ch.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
        });
    }
}

module.exports = Amqp;