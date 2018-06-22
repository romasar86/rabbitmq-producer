const amqp = require("amqplib");

let channel = null;

class Amqp {
    constructor(options) {
        this.options = options;
    }

    connect() {
        if(channel) return Promise.resolve(channel);
        return amqp.connect(`amqp://${this.options.host}:${this.options.port}`)
            .then(connection => connection.createChannel())
            .then(ch => {
                ch.assertQueue(this.options.queueName, { durable: false });
                channel = ch;
                return channel;
            });
    }

    send(data) {
        return this.connect().then(ch => {
            return ch.sendToQueue(this.options.queueName, Buffer.from(JSON.stringify(data)));
        });
    }

}

module.exports = Amqp;