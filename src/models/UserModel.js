class UserModel {
    constructor() {
        this.login = "";
        this.email = "";
    }

    /**
     * Async check on current user auth. Current user model is saved in localStorage.
     *
     * @param serviceLocator
     * @param force
     * @returns {Promise} in resolve we get UserModel. When is auth false - call reject
     */
    static isAuth(serviceLocator = undefined, force = false) {
        if (force) {
            return serviceLocator.api.post("user")
                .then((dataFromServer) => {
                    return dataFromServer.json();
                }) // FUCKING JAVASCRIPT STYLE
                .then((json) => {
                    return UserModel.fromJson(json);
                });
        } else {
            return new Promise(function (resolve, reject) {
                let model = localStorage.getItem("user");
                if (model !== undefined) {
                    resolve(model);
                } else {
                    reject();
                }
            });
        }
    }

    static fromJson(json) {
        let model = new UserModel();
        model.login = json.login;
        model.email = json.email;
        return model;
    }

    /**
     * Saving current object in localStorage
     */
    saveInLocalStorage() {
        localStorage.setItem("user", this);
    }

    static getAuth() {
        let userModel = localStorage.getItem("user");

        if (userModel === undefined) {
            userModel = new UserModel();
        }

        return userModel;
    }
}

module.exports = UserModel;