const View = require('../View.js');
const TemplatedViewMixin = require('../_view_mixins/TemplatedViewMixin.js');
const RouterLinksViewMixin = require('../_view_mixins/RouterLinksViewMixin.js');
const template = require('./template.pug');
const displayErrorsUtils = require('../_form_utils/displayErrors.js');

const LoginForm = require('../../models/LoginForm.js');
const UserModel = require('../../models/UserModel.js');


class LoginModalView extends View {
    open() {
        this.loginForm = document.getElementById('login-form');
        this._initForm();
        if (this._savedModel) {
            this._fillForm(this._savedModel);
        }
    }

    close() {
        this._savedModel = this._createModel();
        this.root.innerHTML = '';
    }

    get template() {
        return template;
    }

    _initForm() {
        displayErrorsUtils.initForm(this.loginForm);

        this.loginForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const model = this._createModel();

            const validationResult = model.validate();
            if (!validationResult.ok) {
                displayErrorsUtils.displayErrors(this.loginForm, validationResult.errors);
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
                    this.serviceLocator.eventBus.emitEvent("auth", this.serviceLocator.user);
                })
                .catch((res) => console.error(res));
        });
    }

    _createModel() {
        const model = new LoginForm(this.serviceLocator);
        model.login = this.loginForm.elements['login'].value;
        model.password = this.loginForm.elements['password'].value;
        return model;
    }

    _fillForm(model) {
        this.loginForm.elements['login'].value = model.login;
        this.loginForm.elements['password'].value = model.password;
    }
}

module.exports = TemplatedViewMixin(RouterLinksViewMixin(LoginModalView));
