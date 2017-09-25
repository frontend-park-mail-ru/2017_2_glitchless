function checkPassword(password) {
	const passwordMinLength = 8;
	if (password.length < passwordMinLength) {
		return `Password\'s length can\'t be less than ${passwordMinLength} symbols`;
	}
}
 
let loginForm = getCurrentModal().getElementsByClassName('login-form')[0];

console.log(loginForm.elements);

loginForm.addEventListener('submit', function (event) {
	event.preventDefault();

	const login = loginForm.elements['login'].value;
	const password = loginForm.elements['password'].value;

	const error = checkPassword(password);
	if (error) 
		alert(error);
		return; //TODO: UI error display

	const requestOptions = { body: JSON.stringify({ "login": login , "password" : password}),
		method: 'GET'};
	const authRequest = new Request(loginApiUrl, requestOptions);
	console.log(authRequest.headers);
	getResponseText(authRequest)
		.then(function (text) {
			console.log(text);
		});
});

// String.prototype.format = String.prototype.f = function(){
// 	var args = arguments;
// 	return this.replace(/\{(\d+)\}/g, function(m,n){
// 		return args[n] ? args[n] : m;
// 	});
// };

// auth(username, password function (err, resp) {
// 	if (err) {
// 		return alert(`AUTH Error: ${err.status}`);
// 	}
// });