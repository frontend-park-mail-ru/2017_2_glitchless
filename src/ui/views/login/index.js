import View from '../View';
import TemplatedViewMixin from '../../mixins/TemplatedViewMixin';
import RouterLinksViewMixin from '../../mixins/RouterLinksViewMixin';
import ModalShadeViewMixin from '../../mixins/ModalShadeViewMixin';
import template from './template.pug';
import './style.scss';
import { displayErrors, displayServerError } from '../../../utils/formDisplayErrors';
import LoginForm from '../../../models/LoginForm';
import UserModel from '../../../models/UserModel';

class LoginModalView extends View {
    open() {
        this.loginForm = document.getElementById('login-form');

        this._validateSubmitWithContext = this._validateSubmit.bind(this);

        this._initForm();
        if (this._savedModel) {
            this._fillForm(this._savedModel);
        }
    }

    close() {
        this.loginForm.removeEventListener('submit', this._validateSubmitWithContext);
        this._savedModel = this._createModel();
        Array.prototype.forEach.call(this.loginForm.elements, (element) => {
            element.oninput = null;
        });
    }

    get template() {
        return template;
    }

    _initForm() {
        this._initiateEmptyErrors();

        this._initiateOnInputChecks();

        this.loginForm.addEventListener('submit', this._validateSubmitWithContext);
    }

    _validateSubmit(event) {
        event.preventDefault();

        const model = this._createModel();

        const validationResult = model.validate();
        if (!validationResult.ok) {
            displayErrors(this.loginForm, validationResult.errors);
            return;
        }
        model.send()
            .then((res) => res.json())
            .catch((res) => res.json())
            .then((json) => {
                if (!json.successful) {
                    const serverErrorField = document.getElementById('login-form-server-error');
                    displayServerError(serverErrorField, json.message);
                    return;
                }
                this.serviceLocator.user = UserModel.fromApiJson(json.message);
                this.serviceLocator.user.saveInLocalStorage();
                this.serviceLocator.router.changePage('/');
                this.serviceLocator.eventBus.emitEvent('auth', this.serviceLocator.user);
            });
    }

    /**
     * Initiate empty field errors (so you can't submit an empty form)
     */
    _initiateEmptyErrors() {
        const model = this._createModel(this.loginForm);
        const validationResult = model.validate();
        if (!validationResult.ok) {
            displayErrors(this.loginForm, validationResult.errors);
        }
    }

    _initiateOnInputChecks() {
        Array.prototype.forEach.call(this.loginForm.elements, function(element) {
            element.oninput = function(event) {
                const model = this._createModel(this.loginForm);
                Array.prototype.forEach.call(this.loginForm.elements, (elem) => {
                    elem.setCustomValidity('');
                });

                const validationResult = model.validate();
                if (!validationResult.ok) {
                    displayErrors(this.loginForm, validationResult.errors);
                    return;
                }
            }.bind(this);
        }.bind(this));
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

LoginModalView = TemplatedViewMixin(RouterLinksViewMixin(ModalShadeViewMixin(LoginModalView)));

export default LoginModalView;
