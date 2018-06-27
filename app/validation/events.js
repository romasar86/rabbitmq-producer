module.exports = {
    type: "object",
    properties: {
        email: {
            type: "string",
            format: "email"
        },
        event: {
            type: "string"
        },
        timestamp: {
            type: "number"
        }
    },
    required: ["email", "event", "timestamp"]
};