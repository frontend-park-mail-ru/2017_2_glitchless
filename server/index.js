const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();


// static
app.use(express.static('dist'));

app.get('*', (req, res) => {
    res.sendFile('dist/index.html', {root: '.'});
});


// stub api
app.use(cors());
app.use(bodyParser.json());

const leaderboardData = new Map();
leaderboardData.set('Ansile', 1337);
leaderboardData.set('LionZXY', 'kotlin.js');
leaderboardData.set('reo7sp', 420);
leaderboardData.set('StealthTech', 0);

app.get('/api/leaderboard', (req, res) => {
    const resJson = {'users': []};
    leaderboardData.forEach((username, score) => {
        resJson['users'].push({'user': username, 'score': score});
    });
    res.json(resJson);
});

app.post('/api/leaderboard', (req, res) => {
    leaderboardData.set('reo7sp', req.body.score);
    res.json({ok: true});
});


const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server started at http://127.0.0.1:${port}`);
});
