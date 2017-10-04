/* eslint-disable no-useless-escape */
/**
 * Validates password.
 *
 * @param password String to validate
 * @returns {Boolean|String} True if ok else message
 */
function validatePassword(password) {
    const passwordMinLength = 1;
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
    const re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
    if (!re.test(email)) {
        return 'Wrong email format';
    }
    return true;
}

module.exports = {
    validatePassword,
    validateEmail
};