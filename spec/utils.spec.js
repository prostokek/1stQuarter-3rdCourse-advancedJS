const utils = require('../utils');

utils.sum(1, 3); // = 4
utils.mul(2, 4); // = 8

describe('Function: sum', () => { // для формирования отчёта, выдаст эту строку
    it('should return 9 when a = 4, b = 5', () => {
        expect(utils.sum(4, 5)).toBe(9);
    });

    it('should return 9 when a = 4, b = 5', () => {
        expect(utils.sum('4', '5')).toBe(9);
    })
})