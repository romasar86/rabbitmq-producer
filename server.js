const express = require("express"),
    app = express(),
    config = require("./app/config"),
    bodyParser = require("body-parser"),
    routes = require("./app/routes");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routes(app);

app.listen(config.port, () => {
    console.log(config.name, "server was started on port - " + config.port);
});