function init(serviceLocator) {
    const menuOpenerButtons = Array.from(document.getElementsByClassName('menu__modal-trigger'));
    menuOpenerButtons.forEach((el) => {
        el.addEventListener('click', () => {
            const page = el.getAttribute('modal-trigger');
            serviceLocator.router.changePage(page);
        });
    });
    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', () => {
        serviceLocator.api.post('logout');
    });
    serviceLocator.eventBus.subscribeOn('auth', (userModel) => {
        if (userModel.login) {
            Array.from(document.getElementsByClassName('menu__user__name--centered')).forEach((el) => {
                el.innerText = userModel.login;
            });
        }
        if (!userModel.login) {
            Array.from(document.getElementsByClassName('menu__user__name--centered')).forEach((el) => {
                el.innerText = ' Unauth User';
            });
        }
    });
}

module.exports = init;