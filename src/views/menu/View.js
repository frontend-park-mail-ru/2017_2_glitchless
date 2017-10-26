const View = require('../View.js');
const template = require('./template.pug');

const UserModel = require('../../models/UserModel.js');


class MenuView extends View {
    open(root) {
        this.root = root;
        this.root.innerHTML = template();

        this._setupChangePageOnClick();
        this._setupLogout();
        this._setupAuthListener();
    }

    _setupChangePageOnClick() {
        const menuOpenerButtons = Array.from(this.root.getElementsByClassName('modal-trigger'));
        menuOpenerButtons.forEach((el) => {
            el.addEventListener('click', () => {
                const page = el.getAttribute('modal-trigger');
                this.serviceLocator.router.changePage(page);
            });
        });
    }

    _setupLogout() {
        const logoutButton = document.getElementById('logout-button');
        logoutButton.addEventListener('click', () => {
            this.serviceLocator.eventBus.emitEvent('auth', null);
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
    }

    _setupAuthListener() {
        const logoutButton = document.getElementById('logout-button');
        this.serviceLocator.eventBus.subscribeOn('auth', (userModel) => {
            if (userModel && userModel.login) {
                console.log(userModel.login);
                Array.from(this.root.getElementsByClassName('menu__user__name')).forEach((el) => {
                    el.innerText = userModel.login;
                });
                logoutButton.style.display = 'block';
            }
            if (!userModel || !userModel.login) {
                Array.from(this.root.getElementsByClassName('menu__user__name')).forEach((el) => {
                    el.innerText = 'Unauth User';
                });
                logoutButton.style.display = 'none';
            }
        });
    }
}

module.exports = MenuView;