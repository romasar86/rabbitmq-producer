const Amqp = require("./../amqp"),
    config = require("./../config");
class EventsController {
    static postEvents (req, res) {
        const amqp = new Amqp(config.queue);
        amqp.send(config.queue.queueNames.events, req.body)
            .then(() => {
                res.status(200).send();
            })
            .catch( err => {
                console.log(err);
                res.status(500).send(err.message);
            });
    }
}

module.exports = EventsController;