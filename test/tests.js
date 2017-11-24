const assert = require('./lib/assert.ts');
const TestSuite = require('./lib/TestSuite.ts');

const validations = require('../src/utils/validations.ts');

const suite = new TestSuite();

suite.addTest('validateEmail accept right emails', () => {
    assert.equal(validations.validateEmail('wow@mail.ru'), true);
    assert.equal(validations.validateEmail('wow@corp.mail.ru'), true);
    assert.equal(validations.validateEmail('artur.udalov@gmail.com'), true);
});

suite.addTest('validateEmail rejects wrong emails', () => {
    assert.notEqual(validations.validateEmail('jnfgjsnfjgn'), true);
    assert.notEqual(validations.validateEmail(''), true);
    assert.notEqual(validations.validateEmail('fjgk__yandex.ru'), true);
});

suite.addTest('validatePassword accept good long passwords', () => {
    assert.equal(validations.validatePassword('xjncknfkxjdnfkxdnfkndfujgh'), true);
    assert.equal(validations.validatePassword('sdjfsjdnfskjdnfskjdf'), true);
});

suite.addTest('validatePassword rejects short passwords', () => {
    assert.notEqual(validations.validatePassword('qwerty'), true);
    assert.notEqual(validations.validatePassword(''), true);
    assert.notEqual(validations.validatePassword('1234'), true);
});

module.exports = suite;