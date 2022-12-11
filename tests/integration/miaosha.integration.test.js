require('dotenv').config('../../.env');
const app = require('../../app');
const request = require('supertest');
const setParameter = require('../../setup/test-parameter');
const Cache = require('../../config/redis-cluster').pubClient;
const { MAX_PEOPLE } = process.env;

describe('Integration test for miaosha api', () => {
    beforeAll(async () => {
        await setParameter();
    });

    test('Succuss Answer', async () => {
        const { body, statusCode } = await request(app).post('/api/1.0/miaosha/').send({ id: 1, question: 1, answer: 'A' });
        expect(statusCode).toBe(200);
        expect(body.message).toBe('秒殺請求已送出');
    });

    test('Wrong answer', async () => {
        const { body, statusCode } = await request(app).post('/api/1.0/miaosha/').send({ id: 1, question: 1, answer: 'B' });
        expect(statusCode).toBe(400);
        expect(body.error).toBe('答案錯誤');
    });

    test('Wrong id', async () => {
        const { body, statusCode } = await request(app).post('/api/1.0/miaosha/').send({ id: -1, question: 1, answer: 'B' });
        expect(statusCode).toBe(400);
        expect(body.error).toBe('Id is wrong');
    });

    test('Without question', async () => {
        const { body, statusCode } = await request(app).post('/api/1.0/miaosha/').send({ id: 1, answer: 'A' });
        expect(statusCode).toBe(400);
        expect(body.error).toBe('id or answer or question missed');
    });

    test('Wrong question', async () => {
        const { body, statusCode } = await request(app).post('/api/1.0/miaosha/').send({ id: 1, question: 6, answer: 'A' });
        expect(statusCode).toBe(400);
        expect(body.error).toBe('Question is wrong');
    });

    test('Wrong question', async () => {
        const { body, statusCode } = await request(app).post('/api/1.0/miaosha/').send({ id: 1, question: -1, answer: 'A' });
        expect(statusCode).toBe(400);
        expect(body.error).toBe('Question is wrong');
    });

    test('Too many people', async () => {
        let result;
        for (let index = 0; index < MAX_PEOPLE + 1; index++) {
            result = await request(app).post('/api/1.0/miaosha/').send({ id: 1, question: 1, answer: 'A' });
        }
        const { body, statusCode } = result;
        expect(statusCode).toBe(200);
        expect(body.message).toBe('秒殺已結束');
    });

    afterAll(async () => {
        await Cache.disconnect();
    });
});
