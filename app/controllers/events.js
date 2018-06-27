const Amqp = require("./../amqp"),
    config = require("./../config"),
    validation = require("./../validation");
class EventsController {
    static postEvents (req, res) {
        const validationInfo = validation.validate(req.body, validation.schemas.events);
        if(!validationInfo.valid) {
            return res.status(400).send(validationInfo.errors);
        }
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