/**
 * Represents user session.
 */
export default class UserModel {
    constructor() {
        this.login = '';
        this.email = '';
    }

    /**
     * Async check on current user auth.
     *
     * @param loadFromServer {Boolean} If true, requests server API. If false, checks local storage. Defaults to false
     * @param serviceLocator {ServiceLocator} Instance of Service Locator. Required then loadFromServer == true
     * @returns {Promise} In resolve we get UserModel. When is auth false - call reject
     */
    static loadCurrent(loadFromServer = false, serviceLocator = null) {
        if (loadFromServer) {
            return serviceLocator.api.get('user')
                .then((dataFromServer) => dataFromServer.json(), {})
                .then((json) => UserModel.fromApiJson(json));
        }

        return new Promise((resolve, reject) => {
            const jsonStr = localStorage.getItem('user');
            if (!jsonStr) {
                reject();
                return;
            }
            const json = JSON.parse(jsonStr);
            if (!json) {
                reject();
                return;
            }
            const model = UserModel.fromApiJson(json);
            resolve(model);
        });
    }

    static loadCurrentSyncronized() {
        return JSON.parse(localStorage.getItem('user'));
    }

    /**
     * Parses server API response and creates model instance.
     *
     * @param json {Object} JSON object from server API
     * @return {UserModel} New model instance
     */
    static fromApiJson(json) {
        const model = new UserModel();
        model.login = json.login;
        model.email = json.email;
        return model;
    }

    /**
     * Saves current object in localStorage
     */
    saveInLocalStorage() {
        try {
            localStorage.setItem('user', JSON.stringify(this));
        } catch (exception) {
            console.log('Error while write to storage!!!\n' + exception);
        }
    }

    static clearInLocalStorage() {
        localStorage.removeItem('user');
    }
}
