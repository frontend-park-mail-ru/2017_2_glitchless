const LoginForm = require('../../models/LoginForm.js');
const displayErrorsUtils = require('./../_form_utils/displayErrors.js');

function init(serviceLocator) {
    const loginForm = document.getElementById('login-form');

    displayErrorsUtils.initFormForDisplayErrors(loginForm);

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const model = new LoginForm(serviceLocator);
        model.login = loginForm.elements['login'].value;
        model.password = loginForm.elements['password'].value;

        const validationResult = model.validate();
        if (validationResult.ok === true) {
            model.send()
                .then((res) => console.log(res.json()))
                .then((res) => console.error(res.json()));
            // TODO: сделать норм ответ
        } else {
            displayErrorsUtils.displayErrors(loginForm, validationResult.errors);
        }
    });
}

module.exports = init;
