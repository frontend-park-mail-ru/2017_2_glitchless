// Get the modal
let modal = document.getElementsByClassName('modal')[0];
let modal__body = document.getElementsByClassName('modal__body')[0];
// Get the button that opens the modal
let triggers = document.getElementsByClassName('modal-trigger');


// Get the <span> element that closes the modal
let span = document.getElementsByClassName('modal-close')[0];

Array.prototype.forEach.call(triggers, function (button) {
	button.onclick = function () {
    modal.style.display = 'block';
    let xhr = new XMLHttpRequest();
    let target = button.getAttribute('modal-trigger');
    xhr.open('GET', target + '.html', false);
    xhr.send();
    if (xhr.status != 200) {
  	// обработать ошибку
	  alert( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
	} else {
	  // вывести результат
	  modal__body.innerHTML = xhr.responseText; // responseText -- текст ответа.
	}
    modal.focus();
	};
});

// // When the user clicks on the button, open the modal 
// btn.onclick = function () {
//     modal.style.display = 'block';
//     let xhr = new XMLHttpRequest();
//     let loading_page = this.getAttribute('modal-trigger');
//     xhr.open('GET', 'login.html', false);
//     xhr.send();
//     if (xhr.status != 200) {
//   	// обработать ошибку
// 	  alert( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
// 	} else {
// 	  // вывести результат
// 	  modal__body.innerHTML = xhr.responseText; // responseText -- текст ответа.
// 	}
//     modal.focus();
// };

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = 'none';
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

const doSubmit = e => {
    //console.log('submit');
    e.preventDefault();
    if (form.parentElement.hidden) return;

    form.parentElement.hidden = true;
    //let str = answer.value || 'нет ответа :(';
    callback(answer.value || 'нет ответа :(');
};