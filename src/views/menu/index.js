const UserModel = require('../../models/UserModel.js');

function init(serviceLocator) {
    const menuOpenerButtons = Array.from(document.getElementsByClassName('modal-trigger'));
    menuOpenerButtons.forEach((el) => {
        el.addEventListener('click', () => {
            const page = el.getAttribute('modal-trigger');
            serviceLocator.router.changePage(page);
        });
    });

    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', () => {

        serviceLocator.eventBus.emitEvent('auth', null);
        UserModel.clearInLocalStorage();
        /* TODO fix server
        serviceLocator.api.post('logout')
            .then((answer) => answer.json())
            .then((json) => {
                console.log(json);
                if (json.successful) {
                    serviceLocator.eventBus.emitEvent('auth', null);
                    UserModel.clearInLocalStorage();
                }
            });*/
    });
    serviceLocator.eventBus.subscribeOn('auth', (userModel) => {
        if (userModel && userModel.login) {
            console.log(userModel.login);
            Array.from(document.getElementsByClassName('menu__user__name')).forEach((el) => {
                el.innerText = userModel.login;
            });
            logoutButton.style.display = 'block';
        }
        if (!userModel || !userModel.login) {
            Array.from(document.getElementsByClassName('menu__user__name')).forEach((el) => {
                el.innerText = 'Unauth User';
            });
            logoutButton.style.display = 'none';
        }
    });
}

module.exports = init;