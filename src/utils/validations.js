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
    if (!email.contains('@')) {
        return 'Wrong email format';
    }
    return true;
}

module.exports = {
    validatePassword,
    validateEmail
};
