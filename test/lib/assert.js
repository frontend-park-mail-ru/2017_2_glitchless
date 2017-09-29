/**
 * Tests that a === b.
 *
 * @param a First argument
 * @param b Second argument
 * @throws Error than a !== b
 */
function equal(a, b) {
    if (a !== b) {
        throw new Error(`'${a}' must equal to '${b}' but its not`);
    }
}

/**
 * Tests that a !== b.
 *
 * @param a First argument
 * @param b Second argument
 * @throws Error than a === b
 */
function notEqual(a, b) {
    if (a === b) {
        throw new Error(`'${a}' must not equal to '${b}' but it it`);
    }
}

module.exports = {
    equal,
    notEqual
};