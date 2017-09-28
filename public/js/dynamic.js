'use strict';

// Get the modal
let modal = document.getElementsByClassName('modal')[0];

let blocks = {
    login: {url: 'login.html'},
    signup: {url: 'signup.html'},
    about: {url: 'about.html'},
    leaders: {url: 'leaders.html'}
};

fetchData(blocks);

function getCurrentModal() {
    return modal;
}

function fetchData(blocks) {
    for (const key in blocks) {
        if (blocks.hasOwnProperty(key)) {
            blocks[key].promisedData = getResponseText(blocks[key].url);
        }
    }
}


modal.content = modal.getElementsByClassName('modal__content')[0];

// Get the button that opens the modal
let triggers = document.getElementsByClassName('menu__modal-trigger');

// Get the element that closes the modal
let modalCloser = document.getElementsByClassName('modal-close')[0];

// When the user clicks on <span> (x), close the modal
modalCloser.onclick = function() {
    modal.style.display = 'none';
};

// Setup the button event functions
Array.prototype.forEach.call(triggers, setModalOpener);



// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};


function setModalOpener(button) {
    modal = getCurrentModal();
    button.onclick = function () {
        modal.style.display = 'block';

        let target = button.getAttribute('modal-trigger');
        blocks[target].promisedData
            .then(function (data) {
                setContent(modal.content, data);
            })
            .then(function () {
                const innerScripts = modal.getElementsByTagName('script');
                executeScripts(innerScripts);
            });
        // let modalRequest = new Request(target + '.html');
        // getResponseText(modalRequest)
        //     .then(function (modalHTML) {
        //         setContent(modal.body, modalHTML)
        //     })
        //     .catch(function (response) {
        //         alert(response.status + ': ' + response.statusText); 
        //         // пример вывода: 404: Not Found
        //     });


    // modal.focus();
    };
}

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