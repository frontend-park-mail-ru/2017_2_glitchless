const baseApiUrl = 'https://glitchless-java.herokuapp.com/api/';
const loginApiUrl = baseApiUrl + 'login';
const signupApiUrl = baseApiUrl + 'signup';

const headersApi = new Headers();
headersApi.append('accept', 'application/json');
headersApi.append('content-type', 'application/json');

function executeScripts(scriptCollection) {
    Array.prototype.forEach.call(scriptCollection, function (script) { 
        eval(script.innerHTML);
    });
}

function getResponseText(request) {
    return new Promise(function (resolve, reject) {
        fetch(request)
            .then(function (response) {
                if (response.ok) {
                    return response.text();
                }
                else {
                    reject(response);
                }
            })
            .then(function (text) {
                resolve(text);
            });
    });
}

function setContent(element, content) {
    element.innerHTML = content;
}
