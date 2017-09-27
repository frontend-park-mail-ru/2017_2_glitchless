const validations = require('../utils/validations.js');

/**
 * Model of login form.
 */
class LoginForm {
    /**
     * @param serviceLocator Instance of service locator.
     */
    constructor(serviceLocator) {
        this.login = null;
        this.password = null;
        this.api = serviceLocator.api;
    }

    /**
     * Validates model values.
     *
     * Spec of result object:
     * {
     *   ok: {Boolean},  // True if validation is ok else false
     *   errors: {Array},  // Empty array if validation is ok else array of errors
     * }
     * Spec of error object:
     * {
     *   field: {String},  // Name of the field
     *   message: {String}  // Message of problem
     * }
     *
     * @return {Object} Result
     */
    validate() {
        let errors = [];

        const passwordValidation = validations.validatePassword(this.password);
        if (passwordValidation !== true) {
            errors.push({field: 'password', message: passwordValidation});
        }

        const ok = errors.length === 0;

        return {ok, errors};
    }

    /**
     * Send form to the server API.
     * @see Api.post
     *
     * @return {Promise}
     */
    send() {
        return this.api.post('login', {login: this.login, password: this.password});
    }
}

module.exports = LoginForm;