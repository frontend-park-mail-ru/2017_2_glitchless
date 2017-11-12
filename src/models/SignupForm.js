import { validateEmail, validatePassword } from '../utils/validations';

/**
 * Model of signup form.
 */
export default class SignupForm {
    /**
     * @param serviceLocator Instance of service locator.
     */
    constructor(serviceLocator) {
        this.login = null;
        this.email = null;
        this.password = null;
        this.passwordConfirmation = null;
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

        if (this.login.length === 0) {
            errors.push({field: 'login', message: 'Login can\'t be empty'});
        }

        const emailValidation = validateEmail(this.email);
        if (emailValidation !== true) {
            errors.push({field: 'email', message: emailValidation});
        }

        const passwordValidation = validatePassword(this.password);
        if (passwordValidation !== true) {
            errors.push({field: 'password', message: passwordValidation});
        }

        if (this.password !== this.passwordConfirmation) {
            errors.push({field: 'passwordConfirmation', message: 'Password confirmation doesn\'t match'});
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
        return this.api.post('signup', {login: this.login, email: this.email, password: this.password});
    }
}
