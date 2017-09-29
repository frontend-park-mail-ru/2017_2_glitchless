/* eslint-disable no-useless-escape */
/**
 * Validates password.
 *
 * @param password String to validate
 * @returns {Boolean|String} True if ok else message
 */
function validatePassword(password) {
    const passwordMinLength = 8;
    if (password.length < passwordMinLength) {
        return `Password's length can't be less than ${passwordMinLength} symbols`;
    }
    return true;
}

/**
 * Validates email.
 *
 * @param email String to validate
 * @returns {Boolean|String} True if ok else message
 */
function validateEmail(email) {
    const re = new RegExp('/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}' +
        '\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/');
    if (!re.test(email)) {
        return 'Wrong email format';
    }
    return true;
}

module.exports = {
    validatePassword,
    validateEmail
};