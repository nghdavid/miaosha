require('dotenv').config();
const amqp = require('amqplib');
const { RABBIT_HOST, RABBIT_PORT, RABBIT_USER, RABBIT_PASSWORD, PROTOCOL } = process.env;
class MessageQueueService {
    constructor(name) {
        this.name = name;
        this.connectParam = {
            protocol: PROTOCOL,
            hostname: RABBIT_HOST,
            port: RABBIT_PORT,
            username: RABBIT_USER,
            password: RABBIT_PASSWORD,
            locale: 'en_US',
            frameMax: 0,
            heartbeat: 0,
            vhost: '/',
        };
    }

    async connect() {
        // Connect to rabbitmq
        this.connection = await amqp.connect(this.connectParam);
        this.connection.on('error', (err) => {
            console.error('Connection to RabbitMQ failed');
            console.error(err);
        });
        this.connection.on('close', () => {
            console.warn('Connection to RabbitMQ closed');
        });
        // Connect to channel
        this.channel = await this.connection.createChannel();
        this.channel.on('error', (err) => {
            console.error('Cannot create channel');
            console.error(err);
        });
        this.channel.on('close', () => {
            console.warn('Connection to channel closed');
        });
    }

    async publishToExchange(exchangeName, queueName, msg) {
        // Use Fanout mode (exchange)
        await this.channel.assertExchange(exchangeName, 'fanout', { durable: false });
        const queue = await this.channel.assertQueue(queueName, { durable: true });
        this.channel.bindQueue(queue.queue, exchangeName, ''); //第三個是routing key
        this.channel.publish(exchangeName, '', Buffer.from(msg));
    }

    async publishToQueue(exchangeName, queueName, msg, ttl) {
        ttl = ttl * 60 * 1000;
        await this.channel.assertQueue(queueName, {
            durable: false,
            messageTtl: ttl,
            deadLetterExchange: exchangeName,
        });
        this.channel.sendToQueue(queueName, Buffer.from(msg));
    }
    closeChannel() {
        this.channel.close();
        console.info('Closing RabbitMQ channel');
    }

    closeConnection() {
        this.connection.close();
        console.info('Closing RabbitMQ connection');
    }
}

module.exports = MessageQueueService;
