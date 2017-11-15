import View from '../View';
import TemplatedViewMixin from '../_view_mixins/TemplatedViewMixin';
import RouterLinksViewMixin from '../_view_mixins/RouterLinksViewMixin';
import template from './template.pug';
import { initDisplayErrorsForm, displayErrors, displayServerError } from '../_form_utils/displayErrors';

import LoginForm from '../../models/LoginForm';
import UserModel from '../../models/UserModel';

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
    }

    get template() {
        return template;
    }

    _initForm() {
        initDisplayErrorsForm(this.loginForm);

        const that = this;

        this.loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const model = that._createModel();

            const validationResult = model.validate();
            if (!validationResult.ok) {
                displayErrors(this.loginForm, validationResult.errors);
                return;
            }
            model.send()
                .then((res) => res.json())
                .then((json) => {
                    if (!json.successful) {
                        const serverErrorField = document.getElementById('login-form__server-errors');
                        displayServerError(serverErrorField, json.message);
                        return;
                    }
                    that.serviceLocator.user = UserModel.fromApiJson(json.message);
                    that.serviceLocator.user.saveInLocalStorage();
                    that.serviceLocator.router.changePage('/');
                    that.serviceLocator.eventBus.emitEvent('auth', that.serviceLocator.user);
                })
                .catch((res) => console.error(res));
        });
    }

    _createModel() {
        const model = new LoginForm(this.serviceLocator);
        model.login = this.loginForm.elements.login.value;
        model.password = this.loginForm.elements.password.value;
        return model;
    }

    _fillForm(model) {
        this.loginForm.elements.login.value = model.login;
        this.loginForm.elements.password.value = model.password;
    }
}

LoginModalView = TemplatedViewMixin(RouterLinksViewMixin(LoginModalView));

export default LoginModalView;
