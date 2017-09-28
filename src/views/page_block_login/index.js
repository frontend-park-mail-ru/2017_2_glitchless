const LoginForm = require('../../models/LoginForm.js');

function init(serviceLocator) {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const fields = {};
        fields['login'] = loginForm.elements['login'];
        fields['password'] = loginForm.elements['password'];
        for (let field in fields) {
            fields[field].oninput = function () { this.setCustomValidity(''); };
        }

        const model = new LoginForm(serviceLocator);
        model.login = fields['login'].value;
        model.password = fields['password'].value;


        const validationResult = model.validate();
        if (validationResult.ok === true) {
            model.send()
                .then((res) => console.log(res.json()))
                .then((res) => console.error(res.json()));
            // TODO: сделать норм ответ
        } else {
            // alert(validationResult.errors);
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
