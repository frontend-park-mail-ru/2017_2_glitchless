const SignupForm = require('../../models/SignupForm.js');
const displayErrorsUtils = require('../_form_utils/displayErrors.js');
const UserModel = require('../../models/UserModel.js');

function init(serviceLocator) {
    const signupForm = document.getElementById('signup-form');

    displayErrorsUtils.initForm(signupForm);

    signupForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const serverErrorField = document.getElementById('login-form__server-errors');
        const model = new SignupForm(serviceLocator);
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
                    serviceLocator.user = UserModel.fromApiJson(json.message);
                    serviceLocator.user.saveInLocalStorage();
                    serviceLocator.router.changePage('');
                    serviceLocator.eventBus.emitEvent("auth", serviceLocator.user);
                    return;
                }
                displayErrorsUtils.displayServerError(serverErrorField, json.message);
            })
            .catch((res) => console.error(res));
    });
}

module.exports = init;
