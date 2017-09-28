const SignupForm = require('../../models/SignupForm.js');
const displayErrorsUtils = require('./../_form_utils/displayErrors.js');
const UserModel = require('../../models/UserModel.js');

function init(serviceLocator) {
    const signupForm = document.getElementById('signup-form');

    displayErrorsUtils.initFormForDisplayErrors(signupForm);

    signupForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const model = new SignupForm(serviceLocator);
        model.login = signupForm.elements['login'].value;
        model.email = signupForm.elements['email'].value;
        model.password = signupForm.elements['password'].value;
        model.passwordConfirmation = signupForm.elements['passwordConfirmation'].value;

        const validationResult = model.validate();
        if (validationResult.ok === true) {
            model.send()
                .then((res) => console.log(res.json()))
                .then((json) => {
                    serviceLocator.user = UserModel.fromApiJson(json);
                    serviceLocator.user.saveInLocalStorage();
                })
                .catch((res) => console.error(res.json()));
            // TODO: сделать норм ответ
        } else {
            displayErrorsUtils.displayErrors(signupForm, validationResult.errors);
        }
    });
}

module.exports = init;
