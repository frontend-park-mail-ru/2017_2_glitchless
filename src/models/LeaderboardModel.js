export default class LeaderboardModel {
    constructor(serviceLocator) {
        this.scores = new Map();
        this.currentUserName = null;
        this.isDirty = false;
        this._api = serviceLocator.stubApi;

        this._loadFromLocalStorage();
    }

    incrementCurrentUserNameScore(value) {
        this.scores.set(this.currentUserName, this.scores.get(this.currentUserName) + value);
        this.isDirty = true;
    }

    load() {
        return this._api.get('leaderboard')
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                this.scores = new Map();
                json.scores.forEach((entry) => {
                    this.scores.set(entry.user, entry.score);
                });
            }).then(() => {
                this._saveToLocalStorage();
            });
    }

    saveCurrentUserScore() {
        this._saveToLocalStorage();
        return this._api.post('leaderboard', {score: this.scores.get(this.currentUserName)})
    }

    canSaveCurrentUserScore() {
        return this.scores.has(this.currentUserName);
    }

    sync() {
        if (!this.isDirty) {
            return this.load();
        }
        return this.saveCurrentUserScore().then(() => this.load());
    }

    _saveToLocalStorage() {
        let scores = {};
        this.scores.forEach((k, v) => {
            scores[k] = v;
        });
        const serializedLeaderboard = JSON.stringify({isDirty: this.isDirty, scores});

        localStorage.setItem('leaderboard', serializedLeaderboard)
    }

    _loadFromLocalStorage() {
        const serializedLeaderboard = localStorage.getItem('leaderboard');
        if (!serializedLeaderboard) {
            return;
        }
        const serializedLeaderboardObj = JSON.parse(serializedLeaderboard);

        this.isDirty = serializedLeaderboardObj.isDirty;

        const scores = serializedLeaderboardObj.scores;
        for (const k in scores) {
            if (scores.hasOwnProperty(k)) {
                this.scores.set(k, scores[k]);
            }
        }
    }
}