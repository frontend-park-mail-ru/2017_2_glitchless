const View = require('../View.js');
const MenuView = require('../menu/View.js');


class DefaultView extends View {
    open(root) {
        root.innerHTML = '';

        const menuEl = document.createElement('span');
        root.appendChild(menuEl);
        const menuView = new MenuView(this.serviceLocator);
        menuView.open(menuEl);
    }
}

module.exports = DefaultView;