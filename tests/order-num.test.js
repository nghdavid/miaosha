const { generateOrderNum } = require('../util/order');
describe('Test Order Num', () => {
    let today;
    beforeEach(() => {
        today = new Date();
    });
    test('Order num year', () => {
        const year = today.getFullYear();
        expect(generateOrderNum(1000000, 6).slice(0, 4)).toBe(year.toString());
    });

    test('Order num month', () => {
        const month = today.getMonth() + 1;
        expect(Number(generateOrderNum(1000000, 6).slice(4, 6))).toBe(month);
    });

    test('Order num day', () => {
        const day = today.getDate();
        expect(Number(generateOrderNum(1000000, 6).slice(6, 8))).toBe(day);
    });

    test('Order num hour', () => {
        const hours = today.getHours();
        expect(Number(generateOrderNum(1000000, 6).slice(8, 10))).toBe(hours);
    });

    test('Order num random number', () => {
        expect(Number(generateOrderNum(1000000, 6).slice(10, 15))).toBeLessThan(1000000);
        expect(Number(generateOrderNum(1000000, 6).slice(10, 15))).toBeGreaterThan(0);
    });

    test('Order num length', () => {
        expect(generateOrderNum(1000000, 6)).toHaveLength(16);
    });
});
