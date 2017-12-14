import View from '../View';
import TemplatedViewMixin from '../../mixins/TemplatedViewMixin';
import RouterLinksViewMixin from '../../mixins/RouterLinksViewMixin';
import template from './template.pug';
import './style.scss';
import UserModel from '../../../models/UserModel';

class MenuView extends View {
    open(root, data = null) {
        this._setupShade();
        this._setupLogout();
        this._setupAuthListener();
        this._syncButtonsWithUserState(this.serviceLocator.user);
    }

    get template() {
        return template;
    }

    _setupShade() {
        document.getElementById('menu-shader').addEventListener('click', () => {
            this.serviceLocator.router.changePage('/');
        });
    }

    _setupLogout() {
        const logoutButton = document.getElementById('logout-button');
        logoutButton.addEventListener('click', () => {
            this.serviceLocator.api.post('logout')
                .then((answer) => answer.json())
                .then((json) => {
                    if (json.successful) {
                        UserModel.clearInLocalStorage();
                        this.serviceLocator.eventBus.emitEvent('auth', null);
                    }
                });
        });
    }

    _setupAuthListener() {
        this.serviceLocator.eventBus.subscribeOn('auth', (userModel) => {
            this._syncButtonsWithUserState(userModel);
        });
    }

    _syncButtonsWithUserState(user) {
        const loginButton = this.root.querySelector('[href="/login"]').parentNode;
        const signupButton = this.root.querySelector('[href="/signup"]').parentNode;
        const logoutButton = document.getElementById('logout-button').parentNode;

        const isLoginned = user && user.login;
        if (isLoginned) {
            loginButton.classList.add('hidden');
            signupButton.classList.add('hidden');
            logoutButton.classList.remove('hidden');
        } else {
            loginButton.classList.remove('hidden');
            signupButton.classList.remove('hidden');
            logoutButton.classList.add('hidden');
        }
    }
}

MenuView = TemplatedViewMixin(RouterLinksViewMixin(MenuView));

export default MenuView;
