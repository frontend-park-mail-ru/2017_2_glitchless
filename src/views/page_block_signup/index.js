const SignupForm = require('../../models/SignupForm.js');

function init(serviceLocator) {
    const signupForm = document.getElementById('signup-form');

    signupForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const model = new SignupForm(serviceLocator);
        model.login = signupForm.elements['login'].value;
        model.email = signupForm.elements['email'].value;
        model.password = signupForm.elements['password'].value;
        model.passwordConfirmation = signupForm.elements['password-conf'].value;

        const validationResult = model.validate();
        if (validationResult.ok === true) {
            model.send()
                .then(console.log)
                .catch(console.error);
            // TODO: сделать норм ответ
        } else {
            alert(validationResult.errors);
            console.error(validationResult.errors);
            // TODO: сделать чтоб прям в формочке ошибки были
        }
    });
}

module.exports = init;
