module.exports = {
    type: "object",
    properties: {
        email: {
            type: "string"
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