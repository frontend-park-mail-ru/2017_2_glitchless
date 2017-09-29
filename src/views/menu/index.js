function init(serviceLocator) {
    const menuButtons = Array.from(document.getElementsByClassName('menu__modal-trigger'));
    menuButtons.forEach((el) => {
        el.addEventListener('click', () => {
            const page = el.getAttribute('modal-trigger');
            serviceLocator.router.changePage(page);
        });
    });
    serviceLocator.eventBus.subscribeOn('auth', (userModel) => {
        if (userModel.login !== undefined) {
            Array.from(document.getElementsByClassName('menu__user--centered__email')).forEach((el) => {
                el.innerText = userModel.login;
            });
        }
    });
}

module.exports = init;