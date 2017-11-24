const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();


// stub api
app.use(cors());
app.use(bodyParser.json());

const leaderboardData = new Map();
leaderboardData.set('Ansile', 1337);
leaderboardData.set('LionZXY', 'kotlin.js');
leaderboardData.set('reo7sp', 420);
leaderboardData.set('StealthTech', 0);
for (let i = 1; i <= 20; i++) {
    leaderboardData.set('some guy ' + i, -i);
}

app.get('/api/leaderboard', (req, res) => {
    console.log('Leaderboard get');
    const resJson = {'scores': []};
    leaderboardData.forEach((username, score) => {
        resJson['scores'].push({'user': username, 'score': score});
    });
    res.json(resJson);
});

app.post('/api/leaderboard', (req, res) => {
    console.log('Leaderboard set ', req.body.score);
    leaderboardData.set('reo7sp', req.body.score);
    res.json({ok: true});
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
