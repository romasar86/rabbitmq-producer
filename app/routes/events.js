const EventsController = require("./../controllers/events");

module.exports = app => {
    app.route("/events")
        .post(EventsController.postEvents);
};