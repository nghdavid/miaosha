const app = require('../../general-app');
const Cache = require('../../config/redis-cluster').pubClient;
const CACHE_USER_KEY = 'id:';
const { STATUS } = require('../../util/status');

const request = require('supertest');

describe('Integration test for prize api', () => {
    let token;
    beforeAll(async () => {
        const masters = Cache.nodes('master');
        await Promise.all(masters.map((node) => node.flushdb()));
        token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiRGF2aWQiLCJpZCI6IjEiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20ifQ.sAJAAbOO_XkrlkJKYoJAVkpTsPU3eUFWgl96Qx2dS5Q';
    });
    test('尚未搶購過', async () => {
        const id = 2;
        await Cache.set(`${CACHE_USER_KEY}${id}`, STATUS.SUCCESS);
        const { body, statusCode } = await request(app).get('/api/1.0/product/prize').set('Authorization', `Bearer ${token}`);
        expect(statusCode).toBe(400);
        expect(body.error).toBe('您尚未搶購過，請先參加搶購');
    });

    test('尚未付款', async () => {
        const id = 1;
        await Cache.set(`${CACHE_USER_KEY}${id}`, STATUS.SUCCESS);
        const { body, statusCode } = await request(app).get('/api/1.0/product/prize').set('Authorization', `Bearer ${token}`);
        expect(statusCode).toBe(400);
        expect(body.error).toBe('您還沒購買到戰利品，請先完成搶購');
    });

    test('搶購成功', async () => {
        const id = 1;
        await Cache.set(`${CACHE_USER_KEY}${id}`, STATUS.PAID);
        const { body, statusCode } = await request(app).get('/api/1.0/product/prize').set('Authorization', `Bearer ${token}`);
        expect(statusCode).toBe(200);
        expect(body.message).toBe('恭喜您搶到戰利品');
    });

    afterAll(async () => {
        await Cache.disconnect();
    });
});
