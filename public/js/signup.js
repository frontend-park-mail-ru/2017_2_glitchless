let signupForm = getCurrentModal().getElementsByClassName('login-form')[0];

console.debug(signupForm.elements);

signupForm.addEventListener('submit', function (event) {
	event.preventDefault();

	const login = signupForm.elements['login'].value;
	const email = signupForm.elements['email'].value;
	const password = signupForm.elements['password'].value;
	const passwordConfirm = signupForm.elements['password-conf'].value;

	if (password !== passwordConfirm) {
		alert('Passwords do not match');
		return;
	}

	const error = checkPassword(password);
	if (error) 
		alert(error);
		return; //TODO: UI error display

	const requestOptions = { 
		body: JSON.stringify({"login": login, "email": email, "password" : password}),
		method: 'POST'
	};
	const authRequest = new Request(loginApiUrl, requestOptions);

	console.log(authRequest.headers);

	getResponseText(authRequest)
		.then(function (text) {
			console.log(text);
		});
});
