const View = require('../View.js');
const template = require('./template.pug');
const displayErrorsUtils = require('../_form_utils/displayErrors.js');

const LoginForm = require('../../models/LoginForm.js');
const UserModel = require('../../models/UserModel.js');


class LoginModalView extends View {
    open(root) {
        root.innerHTML = template();

        const loginForm = document.getElementById('login-form');

        displayErrorsUtils.initForm(loginForm);

        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const serverErrorField = document.getElementById('login-form__server-errors');
            const model = new LoginForm(this.serviceLocator);
            model.login = loginForm.elements['login'].value;
            model.password = loginForm.elements['password'].value;

            const validationResult = model.validate();
            if (validationResult.ok === true) {
                model.send()
                    .then((res) => res.json())
                    .then((json) => {
                        console.log(json);
                        if (json.successful) {
                            this.serviceLocator.user = UserModel.fromApiJson(json.message);
                            this.serviceLocator.user.saveInLocalStorage();
                            this.serviceLocator.router.changePage('/');
                            this.serviceLocator.eventBus.emitEvent("auth", this.serviceLocator.user);
                            return;
                        }
                        displayErrorsUtils.displayServerError(serverErrorField, json.message);
                    })
                    .catch((res) => console.error(res));
            } else {
                displayErrorsUtils.displayErrors(loginForm, validationResult.errors);
            }
        });
    }
}

module.exports = LoginModalView;
