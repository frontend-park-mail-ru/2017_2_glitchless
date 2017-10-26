const View = require('../View.js');
const MenuView = require('../menu/View.js');
const ModalView = require('./ModalView.js');


class SignupView extends View {
    open(root) {
        root.innerHTML = '';

        const menuEl = document.createElement('span');
        root.appendChild(menuEl);
        const menuView = new MenuView(this.serviceLocator);
        menuView.open(menuEl);

        const modalEl = document.createElement('span');
        root.appendChild(modalEl);
        const modalView = new ModalView(this.serviceLocator);
        modalView.open(modalEl);
    }
}

module.exports = SignupView;