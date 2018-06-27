const Validator = require("jsonschema").Validator;

exports.schemas = {
    events: require("./events")
};

exports.validate = (data, schema) => {
    const v = new Validator();
    return v.validate(data, schema);
};