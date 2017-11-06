const View = require('../View.js');
const TemplatedViewMixin = require('../TemplatedViewMixin.js');
const template = require('./template.pug');
const displayErrorsUtils = require('../_form_utils/displayErrors.js');

const SignupForm = require('../../models/SignupForm.js');
const UserModel = require('../../models/UserModel.js');


class SignupModalView extends View {
    open(root) {
        const signupForm = document.getElementById('signup-form');
        displayErrorsUtils.initForm(signupForm);
        this._setupSignupSubmit(signupForm);
    }

    get template() {
        return template;
    }

    _setupSignupSubmit(signupForm) {
        signupForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const serverErrorField = document.getElementById('login-form__server-errors');
            const model = new SignupForm(this.serviceLocator);
            model.login = signupForm.elements['login'].value;
            model.email = signupForm.elements['email'].value;
            model.password = signupForm.elements['password'].value;
            model.passwordConfirmation = signupForm.elements['passwordConfirmation'].value;

            const validationResult = model.validate();
            if (!validationResult.ok) {
                displayErrorsUtils.displayErrors(signupForm, validationResult.errors);
                return;
            }

            model.send()
                .then((res) => res.json())
                .then((json) => {
                    console.log(json);
                    if (json.successful) {
                        this.serviceLocator.user = UserModel.fromApiJson(json.message);
                        this.serviceLocator.user.saveInLocalStorage();
                        this.serviceLocator.router.changePage('/');
                        this.serviceLocator.eventBus.emitEvent('auth', this.serviceLocator.user);
                        return;
                    }
                    displayErrorsUtils.displayServerError(serverErrorField, json.message);
                })
                .catch((res) => console.error(res));
        });
    }
}

module.exports = TemplatedViewMixin(SignupModalView);

