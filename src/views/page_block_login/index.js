const LoginForm = require('../../models/LoginForm.js');

function init(serviceLocator) {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const model = new LoginForm(serviceLocator);
        model.login = loginForm.elements['login'].value;
        model.password = loginForm.elements['password'].value;

        const validationResult = model.validate();
        if (validationResult.ok === true) {
            model.send()
                .then(console.log)
                .catch(console.error);
            // TODO: сделать норм ответ
        } else {
            alert(validationResult.errors);
            // TODO: сделать чтоб прям в формочке ошибки были
        }
    });
}

module.exports = init;
