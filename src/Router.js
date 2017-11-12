import MenuView from './views/menu/View';
import EmptyView from './views/empty/View';
import GameView from './views/game/View';
import AboutView from './views/about/View';
import LeadersView from './views/leaders/View';
import LoginView from './views/login/View';
import SignupView from './views/signup/View';

/**
 * Changes the page according to url hash.
 */
export default class Router {
    constructor(serviceLocator) {
        this.serviceLocator = serviceLocator;

        this._routerGroups = [
            new MenuRouterGroup(this.serviceLocator),
            new GameRouterGroup(this.serviceLocator),
        ];
        this._currentRouterGroup = null;
    }

    /**
     * Setups listeners and initializes the page.
     */
    init() {
        window.onpopstate = (event) => {
            const path = location.pathname;
            const routerGroup = this._routerGroups.find(g => g.isPathOfGroup(path));

            if (this._currentRouterGroup !== routerGroup) {
                if (this._currentRouterGroup) {
                    this._currentRouterGroup.close();
                }
                this._currentRouterGroup = routerGroup;
                this._currentRouterGroup.open();
            }
            this._currentRouterGroup.revert(path, event.state);
        };

        this.changePage(location.pathname);
    }

    /**
     * Changes page block.
     *
     * @param path {String} Path part of the URL string
     */
    changePage(path) {
        const routerGroup = this._routerGroups.find(g => g.isPathOfGroup(path));

        if (this._currentRouterGroup !== routerGroup) {
            if (this._currentRouterGroup) {
                this._currentRouterGroup.close();
            }
            this._currentRouterGroup = routerGroup;
            this._currentRouterGroup.open();
        }
        const changeData = this._currentRouterGroup.change(path);
        history.pushState(changeData.state, changeData.title, path);
    }
}

/* tslint:disable:no-empty */
class RouterGroup {
    constructor(serviceLocator) {
        this.serviceLocator = serviceLocator;
    }

    /**
     * @param path {String} Url path
     * @return {bool} True if path matches this group, else false.
     */
    isPathOfGroup(path) {
    }

    /**
     * Is executed than router switched to this group.
     */
    open() {
    }

    /**
     * Is executed than router changes paths.
     *
     * @param path {String} Url path
     * @return {Object} Change data
     */
    change(path) {
    }

    /**
     * Is executed than user goes back and forward in history.
     *
     * @param path {String} Url path
     * @param state {Object} State object saved from change data
     */
    revert(path, state) {
    }

    /**
     * Is executed than router matched another group and before router switched to it.
     */
    close() {
    }
}
/* eslint-enable */

class MenuRouterGroup extends RouterGroup {
    constructor(serviceLocator) {
        super(serviceLocator);

        this._routes = {
            '/': {
                viewClass: EmptyView,
                title: 'Glitchless',
            },
            '/about': {
                viewClass: AboutView,
                title: 'About',
            },
            '/leaders': {
                viewClass: LeadersView,
                title: 'Leaders',
            },
            '/login': {
                viewClass: LoginView,
                title: 'Login',
            },
            '/signup': {
                viewClass: SignupView,
                title: 'Sign up',
            },
        };

        this._menuView = new MenuView(this.serviceLocator);
        this._modalSpan = null;
        this._currentModalView = null;
        this._modalViewCache = {};
    }

    isPathOfGroup(path) {
        return this._routes.hasOwnProperty(path);
    }

    open() {
        const root = document.body;

        root.innerHTML = '';

        const menuSpan = document.createElement('span');
        root.appendChild(menuSpan);
        this._menuView.open(menuSpan);

        const modalSpan = document.createElement('span');
        root.appendChild(modalSpan);
        this._modalSpan = modalSpan;
    }

    change(path) {
        if (this._currentModalView) {
            this._currentModalView.close();
        }

        const viewClass = this._routes[path].viewClass;
        const title = this._routes[path].title;
        this._currentModalView = new viewClass(this.serviceLocator);
        this._currentModalView.open(this._modalSpan);

        const viewId = Math.random().toString();
        this._modalViewCache[viewId] = this._currentModalView;
        return {title, state: {viewId}};
    }

    revert(path, state) {
        if (this._currentModalView) {
            this._currentModalView.close();
        }

        if (state && state.viewId && this._modalViewCache.hasOwnProperty(state.viewId)) {
            this._currentModalView = this._modalViewCache[state.viewId];
            this._currentModalView.open(this._modalSpan);
        } else {
            this.change(path);
        }
    }

    close() {
        if (this._currentModalView) {
            this._currentModalView.close();
        }
        this._menuView.close();
        document.body.innerHTML = '';
    }
}

class GameRouterGroup extends RouterGroup {
    constructor(serviceLocator) {
        super(serviceLocator);
        this._view = null;
    }

    isPathOfGroup(path) {
        return path === '/play';
    }

    open() {
        this._view = new GameView(this.serviceLocator);
        this._view.open(document.body);
    }

    change() {
        return {title: 'Glitchless'};
    }

    revert() {
    }

    close() {
        this._view.close();
    }
}
