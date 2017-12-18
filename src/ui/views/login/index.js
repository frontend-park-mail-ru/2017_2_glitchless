import View from '../View';
import TemplatedViewMixin from '../../mixins/TemplatedViewMixin';
import RouterLinksViewMixin from '../../mixins/RouterLinksViewMixin';
import ModalShadeViewMixin from '../../mixins/ModalShadeViewMixin';
import template from './template.pug';
import './style.scss';
import { initDisplayErrorsForm, displayErrors, displayServerError } from '../../../utils/formDisplayErrors';
import LoginForm from '../../../models/LoginForm';
import UserModel from '../../../models/UserModel';

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

        this.loginForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const model = this._createModel();

            const validationResult = model.validate();
            if (!validationResult.ok) {
                displayErrors(this.loginForm, validationResult.errors);
                return;
            }
            model.send()
                .then((res) => res.json())
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
                })
                .catch((res) => {
                    const errorElem = document.getElementById('login-form-server-error');
                    errorElem.classList.remove('hidden');
                    errorElem.textContent = 'Unknown error';
                });
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

LoginModalView = TemplatedViewMixin(RouterLinksViewMixin(ModalShadeViewMixin(LoginModalView)));

export default LoginModalView;
