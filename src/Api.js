/**
 * Sends requests to server api.
 */
export default class Api {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    /**
     * Sends HTTP GET request to server api.
     *
     * @param {String} path Path to api method
     * @param {Object} data Object to send. It will be serialized to json
     * @return {Promise} Promise of `fetch` function.
     */
    get(path, data = null) {
        return this._request('GET', path, data);
    }

    /**
     * Sends HTTP POST request to server api.
     *
     * @param {String} path Path to api method
     * @param {Object} data Object to send. It will be serialized to json
     * @return {Promise} Promise of `fetch` function.
     */
    post(path, data = null) {
        return this._request('POST', path, data);
    }

    _request(method, path, data = null) {
        const fetchOptions = {
            method: method,
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            mode: 'cors',
        };
        if (data) {
            fetchOptions.body = JSON.stringify(data);
        }
        return fetch(`${this.baseUrl}/${path}`, fetchOptions);
    }
}
