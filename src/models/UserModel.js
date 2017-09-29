/**
 * Represents user session.
 */
class UserModel {
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
            return serviceLocator.api.post('user')
                .then((dataFromServer) => dataFromServer.json())
                .then((json) => UserModel.fromApiJson(json));
        } else {
            return new Promise((resolve, reject) => {
                let model = JSON.parse(localStorage.getItem('user'));
                if (model !== undefined) {
                    resolve(model);
                    return;
                }
                reject();
            });
        }
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
        localStorage.setItem('user', JSON.stringify(this));
    }

    static clearInLocalStorage() {
        localStorage.removeItem('user');
    }
}

module.exports = UserModel;