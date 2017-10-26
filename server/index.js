const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();


// api
const data = {loginUsers: [], signupUsers: []};

app.use(cors());
app.use(bodyParser.json());

app.post('/api/login', (req, res) => {
    if (!data.signupUsers.includes(req.body.login)) {
        res.status(400);
        res.json({'ok': false, 'error': 'User don\'t exists'});
        return;
    }
    data.loginUsers.push(req.body.login);
    res.json({'ok': true});
});

app.post('/api/signup', (req, res) => {
    if (data.signupUsers.includes(req.body.login)) {
        res.status(400);
        res.json({'ok': false, 'error': 'User has already signed up'});
        return;
    }
    data.signupUsers.push(req.body.login);
    res.json({'ok': true});
});


// static
app.use(express.static('dist'));

app.get('*', (req, res) => {
    res.sendFile('dist/index.html', {root: '.'});
});


const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server started at http://127.0.0.1:${port}`);
});
