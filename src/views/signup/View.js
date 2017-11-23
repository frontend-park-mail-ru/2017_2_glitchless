import View from '../View';
import TemplatedViewMixin from '../_view_mixins/TemplatedViewMixin';
import RouterLinksViewMixin from '../_view_mixins/RouterLinksViewMixin';
import template from './template.pug';
import { initDisplayErrorsForm, displayErrors, displayServerError } from '../_form_utils/displayErrors';

import SignupForm from '../../models/SignupForm';
import UserModel from '../../models/UserModel';

class SignupModalView extends View {
    open() {
        this.signupForm = document.getElementById('signup-form');
        initDisplayErrorsForm(this.signupForm);
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
        const that = this;
        this.signupForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const model = that._createModel(this.signupForm);

            const validationResult = model.validate();
            if (!validationResult.ok) {
                displayErrors(that.signupForm, validationResult.errors);
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
        const model = new SignupForm(this.serviceLocator);
        model.login = this.signupForm.elements.login.value;
        model.email = this.signupForm.elements.email.value;
        model.password = this.signupForm.elements.password.value;
        model.passwordConfirmation = this.signupForm.elements.passwordConfirmation.value;
        return model;
    }

    _fillForm(model) {
        this.signupForm.elements.login.value = model.login;
        this.signupForm.elements.email.value = model.email;
        this.signupForm.elements.password.value = model.password;
        this.signupForm.elements.passwordConfirmation.value = model.passwordConfirmation;
    }
}

SignupModalView = TemplatedViewMixin(RouterLinksViewMixin(SignupModalView));

export default SignupModalView;
