'use strict';

// Get the modal
let modal = document.getElementsByClassName('modal')[0];

function getCurrentModal() {
    return modal;
}

// function getActiveComponent() {
//     return;
// }

// function getPromisedComponent(name, requireNew = false) {
//     let dict = {
//         loginBlock: requestLoginBlock,
//         signupBlock: requestSignupBlock,
//         aboutBlock: requestAboutBlock,
//         leadersBlock: requestLeadersBlock
//     }
//     if (dict[name]) {
//         if (!requireNew) {
//             return 
//         }
//     }
// }

// function requestLoginBlock() {
//     loginBlockURL = 'login.html';
//     return new Promise(function (resolve, reject) {

//     });
// }


modal.body = document.getElementsByClassName('modal__body')[0];

// Get the button that opens the modal
let triggers = document.getElementsByClassName('menu__modal-trigger');

// Get the element that closes the modal
let modalCloser = document.getElementsByClassName('modal-close')[0];

// Setup the button event functions
Array.prototype.forEach.call(triggers, setModalOpener);


// When the user clicks on <span> (x), close the modal
modalCloser.onclick = function() {
    modal.style.display = 'none';
};


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

        let modalRequest = new Request(target + '.html');

        getResponseText(modalRequest)
            .then(function (modalHTML) {
                modal.body.innerHTML = modalHTML;
            })
            .catch(function (response) {
                alert(response.status + ': ' + response.statusText); 
                // пример вывода: 404: Not Found
            });
    // modal.focus();
    };
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
