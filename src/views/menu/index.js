function init(serviceLocator) {
    const menuButtons = Array.from(document.getElementsByClassName('menu__modal-trigger'));
    menuButtons.forEach((el) => {
        el.addEventListener('click', () => {
            const page = el.getAttribute('modal-trigger');
            serviceLocator.router.changePage(page);
        });
    });

}

module.exports = init;