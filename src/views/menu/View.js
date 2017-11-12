import View from '../View';
import TemplatedViewMixin from '../_view_mixins/TemplatedViewMixin';
import RouterLinksViewMixin from '../_view_mixins/RouterLinksViewMixin';
import template from './template.pug';

import UserModel from '../../models/UserModel';

class MenuView extends View {
    open(root) {
        this._setupChangePageOnClick();
        this._setupLogout();
        this._setupAuthListener();
    }

    get template() {
        return template;
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
            this.serviceLocator.api.post('logout')
                .then((answer) => answer.json())
                .then((json) => {
                    console.log(json);
                    if (json.successful) {
                        this.serviceLocator.eventBus.emitEvent('auth', null);
                        UserModel.clearInLocalStorage();
                    }
                });
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

MenuView = TemplatedViewMixin(RouterLinksViewMixin(MenuView));

export default MenuView;
