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
                .then((dataFromServer) => {
                    return dataFromServer.json();
                })
                .then((json) => {
                    return UserModel.fromApiJson(json);
                });
        } else {
            return new Promise(function (resolve, reject) {
                let model = localStorage.getItem('user');
                if (model !== undefined) {
                    resolve(model);
                } else {
                    reject();
                }
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
        let model = new UserModel();
        model.login = json.login;
        model.email = json.email;
        return model;
    }

    /**
     * Saves current object in localStorage
     */
    saveInLocalStorage() {
        localStorage.setItem('user', this);
    }
}

module.exports = UserModel;