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
	if (error) {
		alert(error);
		return; //TODO: UI error display
	}
	const requestOptions = { body: JSON.stringify({"login": login , "password" : password}),
		headers : headersApi,
		method: 'POST'};
	console.log('1');
	console.log(requestOptions['body']);
	const authRequest = new Request(loginApiUrl, requestOptions);
	console.log('2');
	console.log(headersApi);
	console.log(authRequest.headers);
	fetch( 
	           'https://glitchless-java.herokuapp.com/api/login', 
	           {mode: 'cors',
	           	body: "{ \"login\": \"string\", \"email\": \"string\", \"password\": \"stringasd\"}",
//requestOptions['body'],
				credentials: 'include',
	           	headers:{"Accept":"application/json;charset=UTF-8","Content-Type":"application/json;charset=UTF-8",},
	           method:'POST'}
	          )
	          .then(console.log)
	          .catch(console.error);

	getResponseText(authRequest)
		.then(function (text) {
			console.log(text);
		})
		.catch(function (resp) {
			console.log(resp.json())
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