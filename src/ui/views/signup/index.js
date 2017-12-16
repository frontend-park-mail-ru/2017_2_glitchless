import View from '../View';
import TemplatedViewMixin from '../../mixins/TemplatedViewMixin';
import RouterLinksViewMixin from '../../mixins/RouterLinksViewMixin';
import ModalShadeViewMixin from '../../mixins/ModalShadeViewMixin';
import template from './template.pug';
import './style.scss';
import {initDisplayErrorsForm, displayErrors, displayServerError} from '../../../utils/formDisplayErrors';
import SignupForm from '../../../models/SignupForm';
import UserModel from '../../../models/UserModel';

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
        this.signupForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const model = this._createModel(this.signupForm);

            const validationResult = model.validate();
            if (!validationResult.ok) {
                displayErrors(this.signupForm, validationResult.errors);
                return;
            }

            model.send()
                .then((res) => res.json())
                .then((json) => {
                    if (!json.successful) {
                        const serverErrorField = document.getElementById('signup-form__server-errors');
                        displayServerError(serverErrorField, json.message);
                        return;
                    }
                    this.serviceLocator.user = UserModel.fromApiJson(json.message);
                    this.serviceLocator.user.saveInLocalStorage();
                    this.serviceLocator.router.changePage('/');
                    this.serviceLocator.eventBus.emitEvent('auth', this.serviceLocator.user);
                })
                .catch((res) => {
                    const errorElem = document.getElementById('signup-form-server-error');
                    errorElem.classList.remove('hidden');
                    if (res !== null) {
                        const jsn = res.json();
                        if (jsn !== null && res.hasOwnProperty('message')) {
                            errorElem.textContent = jsn.message;
                            return;
                        }
                    }
                    errorElem.textContent = 'Unknown error';
                });
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

SignupModalView = TemplatedViewMixin(RouterLinksViewMixin(ModalShadeViewMixin(SignupModalView)));

export default SignupModalView;
