const SignupForm = require('../../models/SignupForm.js');

function init(serviceLocator) {
    const signupForm = document.getElementById('signup-form');

    signupForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const fields = {};
        fields['login'] = signupForm.elements['login'];
        fields['email'] = signupForm.elements['email'];
        fields['password'] = signupForm.elements['password'];
        fields['passwordConfirmation'] = signupForm.elements['password-conf'];
        for (let field in fields) {
            fields[field].oninput = function () { this.setCustomValidity(''); };
        }
    
        const model = new SignupForm(serviceLocator);
        model.login = fields['login'].value;
        model.email = fields['email'].value;
        model.password = fields['password'].value;
        model.passwordConfirmation = fields['passwordConfirmation'].value;

        const validationResult = model.validate();
        if (validationResult.ok === true) {
            model.send()
                .then((res) => console.log(res.json()))
                .then((res) => console.error(res.json()));
            // TODO: сделать норм ответ
        } else {
            displayErrors(validationResult.errors, fields);
            console.error(validationResult.errors);
            // TODO: сделать чтоб прям в формочке ошибки были
        }
    });
}

function displayErrors(errors, fields) {
    errors.forEach(function (error) {
        // fields[error.field].nextSibling.innerHTML = error.message;
        fields[error.field].setCustomValidity(error.message);
    });
}

module.exports = init;
