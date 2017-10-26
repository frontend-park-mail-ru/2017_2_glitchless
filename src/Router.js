const DefaultView = require('./views/default/View.js');
const AboutView = require('./views/about/View.js');
const LeadersView = require('./views/leaders/View.js');
const LoginView = require('./views/login/View.js');
const SignupView = require('./views/signup/View.js');

/**
 * Changes the page according to url hash.
 */
class Router {
    constructor(serviceLocator) {
        this.serviceLocator = serviceLocator;
    }

    /**
     * Setups listeners and initializes the page.
     */
    init() {
        this._routes = {
            '/': {
                viewClass: DefaultView,
                title: 'Glitchless'
            },
            '/about': {
                viewClass: AboutView,
                title: 'About'
            },
            '/leaders': {
                viewClass: LeadersView,
                title: 'Leaders'
            },
            '/login': {
                viewClass: LoginView,
                title: 'Login'
            },
            '/signup': {
                viewClass: SignupView,
                title: 'Sign up'
            },
        };
        this._viewCache = {};
        this._currentView = null;

        this._initListeners();
        this._setPageFromLocation();
    }

    /**
     * Changes page block.
     *
     * @param path {String} Path part of the URL string
     * @param state {Object} Some state
     */
    changePage(path, state={}) {
        const route = this._routes[path];
        if (!route) {
            throw new Error('No such route');
        }

        const view = new route.viewClass(this.serviceLocator);

        const viewId = Math.random().toString();
        this._viewCache[viewId] = view;
        const historyState = { viewId, state };
        history.pushState(historyState, route.title, path);

        if (this._currentView) {
            this._currentView.close();
        }
        this._currentView = view;
        this._currentView.open(document.body, state);
    }

    _initListeners() {
        window.onpopstate = (event) => {
            if (this._currentView) {
                this._currentView.close();
            }

            if (!event.state || !event.state.viewId) {
                document.body.innerHTML = '';
                return;
            }
            this._currentView = this._viewCache[event.state.viewId];
            this._currentView.open(document.body, event.state.state);
        };
    }

    _setPageFromLocation() {
        this.changePage(document.location.pathname);
    }
}

module.exports = Router;
