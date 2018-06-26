const   assert = require("chai").assert, 
    sinon = require("sinon"),
    proxyquire = require("proxyquire"),
    Amqp = require("./../../app/amqp");

describe("Amqp", () => {
    describe("#constructor()", () => {
        it("it should set proper options", () => {
            const options = {
                    host: "testHost",
                    port: "5672"
                },
                amqp = new Amqp(options);
            assert.deepEqual(amqp.options, options);
        });
    });

    describe("#createConnection()", () => {
        it("it should build proper link and resolve with connection", (done) => {
            const options = {
                    host: "testHost",
                    port: "5672"
                },
                expectedUrl = `amqp://${options.host}:${options.port}`,
                connection = { test: "test"},
                amqplibMock = {
                    connect: sinon.stub().resolves(connection)
                },
                AmqpMocked = proxyquire("./../../app/amqp", {
                    "amqplib": amqplibMock
                }),
                amqp = new AmqpMocked(options);
            amqp.createConnection().then((conn) => {
                assert.deepEqual(conn, connection);
                assert.isTrue(amqplibMock.connect.calledOnce);
                assert.isTrue(amqplibMock.connect.calledWith(expectedUrl));
                done();
            }).catch(done);
        });

        it("it should reject with error", (done) => {
            const options = {
                    host: "testHost",
                    port: "5672"
                },
                amqplibMock = {
                    connect: sinon.stub().rejects()
                },
                AmqpMocked = proxyquire("./../../app/amqp", {
                    "amqplib": amqplibMock
                }),
                amqp = new AmqpMocked(options);
            amqp.createConnection().then(done).catch((err) => {
                assert.instanceOf(err, Error);
                done();
            });
        });
    });

    describe("#createChannel()", () => {
        it("it should resolve with channel", (done) => {
            const channel = {test: "test"},
                connectionMock = {
                    createChannel: sinon.stub().resolves(channel)
                },
                amqp = new Amqp();
           
            amqp.createChannel(connectionMock).then((ch) => {
                assert.deepEqual(ch, channel);
                assert.isTrue(connectionMock.createChannel.calledOnce);
                done();
            }).catch(done);

        });
    });

    describe("#storeChannel()", () => {
        it("it should store channel object into variable out of class", () => {
            const channel = { test: "test" },
                amqp = new Amqp();
            amqp.storeChannel(channel);
            assert.deepEqual(amqp.channel, channel);
            amqp.channel = null;
        });
    });

    describe("#connect()", () => {
        it("it should not invoke createConnection as channel was set previously", (done) => {
            const channel = { test: "test"},
                amqp = new Amqp();
            sinon.stub(amqp, "createConnection").resolves();
            sinon.stub(amqp, "createChannel").resolves();
            sinon.stub(amqp, "storeChannel").returns();
            amqp.channel = channel;
            amqp.connect().then((actualChannel) => {
                assert.deepEqual(actualChannel, channel);
                assert.isTrue(amqp.createConnection.notCalled);
                assert.isTrue(amqp.createChannel.notCalled);
                assert.isTrue(amqp.storeChannel.notCalled);
                done();
                amqp.channel = null;
            }).catch(done);
        });

        it("it should invoke createConnection as channel was not set previously", (done) => {
            const channel = { test: "test"},
                amqp = new Amqp();
            sinon.stub(amqp, "createConnection").resolves();
            sinon.stub(amqp, "createChannel").resolves();
            sinon.stub(amqp, "storeChannel").returns(channel);
            amqp.connect().then((actualChannel) => {
                assert.deepEqual(actualChannel, channel);
                assert.isTrue(amqp.createConnection.calledOnce);
                assert.isTrue(amqp.createChannel.calledOnce);
                assert.isTrue(amqp.storeChannel.calledOnce);
                done();
            }).catch(done);
        });
    });

    describe("#send()", () => {
        it("it should send proper message to proper queue", (done) => {
            const channelMock = {
                    assertQueue: sinon.stub().returns(),
                    sendToQueue: sinon.stub().resolves()
                },
                amqp = new Amqp(),
                queueName = "testQueue",
                message = { test: "test" };
            sinon.stub(amqp, "connect").resolves(channelMock);
            amqp.send(queueName, message).then(() => {
                assert.isTrue(amqp.connect.calledOnce);
                assert.isTrue(channelMock.assertQueue.calledOnce);
                assert.isTrue(channelMock.assertQueue.calledWith(queueName));
                assert.isTrue(channelMock.sendToQueue.calledOnce);
                assert.isTrue(channelMock.sendToQueue.calledWith(queueName));
                assert.deepEqual(message, JSON.parse(channelMock.sendToQueue.args[0][1].toString()));
                done();
            }).catch(done);
        });
    });
});