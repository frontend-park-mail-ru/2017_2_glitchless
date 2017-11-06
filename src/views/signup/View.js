const View = require('../View.js');
const TemplatedViewMixin = require('../_view_mixins/TemplatedViewMixin.js');
const RouterLinksViewMixin = require('../_view_mixins/RouterLinksViewMixin.js');
const template = require('./template.pug');
const displayErrorsUtils = require('../_form_utils/displayErrors.js');

const SignupForm = require('../../models/SignupForm.js');
const UserModel = require('../../models/UserModel.js');


class SignupModalView extends View {
    open() {
        this.signupForm = document.getElementById('signup-form');
        displayErrorsUtils.initForm(this.signupForm);
        this._setupSignupSubmit();
        if (this._savedModel) {
            this._fillForm(this._savedModel);
        }
    }

    get template() {
        return template;
    }

    close() {
        this._savedModel = this._createModel();
    }

    _setupSignupSubmit() {
        this.signupForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const model = this._createModel(this.signupForm);

            const validationResult = model.validate();
            if (!validationResult.ok) {
                displayErrorsUtils.displayErrors(this.signupForm, validationResult.errors);
                return;
            }

            model.send()
                .then((res) => res.json())
                .then((json) => {
                    if (!json.successful) {
                        const serverErrorField = document.getElementById('login-form__server-errors');
                        displayErrorsUtils.displayServerError(serverErrorField, json.message);
                        return;
                    }
                    this.serviceLocator.user = UserModel.fromApiJson(json.message);
                    this.serviceLocator.user.saveInLocalStorage();
                    this.serviceLocator.router.changePage('/');
                    this.serviceLocator.eventBus.emitEvent('auth', this.serviceLocator.user);
                })
                .catch((res) => console.error(res));
        });
    }

    _createModel() {
        const model = new SignupForm(this.serviceLocator);
        model.login = this.signupForm.elements['login'].value;
        model.email = this.signupForm.elements['email'].value;
        model.password = this.signupForm.elements['password'].value;
        model.passwordConfirmation = this.signupForm.elements['passwordConfirmation'].value;
        return model;
    }

    _fillForm(model) {
        this.signupForm.elements['login'].value = model.login;
        this.signupForm.elements['email'].value = model.email;
        this.signupForm.elements['password'].value = model.password;
        this.signupForm.elements['passwordConfirmation'].value = model.passwordConfirmation;
    }
}

module.exports = TemplatedViewMixin(RouterLinksViewMixin(SignupModalView));

