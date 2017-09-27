function init() {
    Array.from(document.getElementsByClassName('menu__modal-trigger')).forEach((el) => {
        el.addEventListener('click', () => {
            const page = el.getAttribute('modal-trigger');
            location.hash = '#' + page;
        });
    });
}

module.exports = init;