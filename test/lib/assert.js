function equal(a, b) {
    if (a !== b) {
        throw new Error(`'${a}' must equal to '${b}' but its not`);
    }
}

function notEqual(a, b) {
    if (a === b) {
        throw new Error(`'${a}' must not equal to '${b}' but it it`);
    }
}

module.exports = {
    equal,
    notEqual
};