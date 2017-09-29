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
        serviceLocator.api.post('logout');
    });
    serviceLocator.eventBus.subscribeOn('auth', (userModel) => {
        if (userModel.login) {
            console.log(userModel.login);
            Array.from(document.getElementsByClassName('menu__user__name')).forEach((el) => {
                el.innerText = userModel.login;
            });
            logoutButton.style.display = 'block';
        }
        if (!userModel.login) {
            Array.from(document.getElementsByClassName('menu__user__name')).forEach((el) => {
                el.innerText = 'Unauth User';
            });
            logoutButton.style.display = 'none';
        }
    });
}

module.exports = init;