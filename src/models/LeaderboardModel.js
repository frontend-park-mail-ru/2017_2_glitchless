export default class LeaderboardModel {
    constructor(serviceLocator) {
        this.scores = new Map();
        this.currentUserName = null;
        this._api = serviceLocator.stubApi;

        this._loadFromLocalStorage();
    }

    incrementCurrentUserNameScore(value) {
        this._saveToLocalStorage();
        this.scores.set(this.currentUserName, this.scores.get(this.currentUserName) + value);
    }

    load() {
        return this._api.get('leaderboard')
            .then((response) => response.json())
            .then((json) => {
                this.scores = new Map();
                json.scores.forEach((entry) => {
                    this.scores.set(entry.user, entry.score);
                });
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
        return this.saveCurrentUserScore().then(() => this.load());
    }

    _saveToLocalStorage() {
        let serializedLeaderboard = {};
        this.scores.forEach((k, v) => {
            serializedLeaderboard[k] = v;
        });
        serializedLeaderboard = JSON.stringify(serializedLeaderboard);

        localStorage.setItem('leaderboard', serializedLeaderboard)
    }

    _loadFromLocalStorage() {
        const serializedLeaderboard = localStorage.getItem('leaderboard');
        if (!serializedLeaderboard) {
            return;
        }
        const serializedLeaderboardObj = JSON.parse(serializedLeaderboard);

        for (const k in serializedLeaderboardObj) {
            if (serializedLeaderboardObj.hasOwnProperty(k)) {
                this.scores[k] = serializedLeaderboardObj[k];
            }
        }
    }
}