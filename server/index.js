/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const data = {loginUsers: [], signupUsers: []};

app.use(cors());
app.use(bodyParser.json());

app.use(express.static('dist'));

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

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server started at http://127.0.0.1:${port}`);
});
