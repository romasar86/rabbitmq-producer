module.exports = {
    name:"rabbitmq-producer-api",
    port: 3000,
    queue: {
        host: "127.0.0.1",
        port: "5672",
        queueName: "events"
    }
};