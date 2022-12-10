const { socketAuth } = require('../../util/auth');
describe('Test socket authentication', () => {
    let jwt;
    let user;
    beforeAll(async () => {
        // jwt token is from https://jwt.io/
        jwt = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiRGF2aWQiLCJpZCI6IjEiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20ifQ.sAJAAbOO_XkrlkJKYoJAVkpTsPU3eUFWgl96Qx2dS5Q';
        user = await socketAuth(jwt);
    });

    test('Socket authentication id', () => {
        expect(user.id).toBe('1');
    });

    test('Socket authentication email', () => {
        expect(user.email).toBe('test@test.com');
    });

    test('Socket authentication name', () => {
        expect(user.name).toBe('David');
    });

    test('Socket authentication empty jwt', async () => {
        const wrongUser = await socketAuth('');
        expect(wrongUser).toBeInstanceOf(Error);
        expect(wrongUser.message).toBe('請先登入！');
    });

    test('Socket authentication wrong jwt', async () => {
        const wrongJwt =
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiRGF2aWQiLCJpZCI6IjEiLCJlbWFpbCI6InRabdAdGVzdC5jb20ifQ.sAJAAbOO_XkrlkabYoJAVkpTsPU3eUFWgl96Qx2dS5Q';
        const wrongUser = await socketAuth(wrongJwt);
        expect(wrongUser).toBeInstanceOf(Error);
        expect(wrongUser.message).toBe('請重新登入！');
    });
});
