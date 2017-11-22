export default class ScoreManager {
    constructor(gameManager) {
        this.eventBus = gameManager.eventBus;
        this.user = gameManager.serviceLocator.user;
        this.leaderboard = gameManager.serviceLocator.leaderboard;

        this.eventBus.subscribeOn('player_won', (winner) => {
            const currentUserIsWinner = winner === 0;
            const onWinScoreChange = 1;
            const onLoseScoreChange = -1;
            this.leaderboard.incrementCurrentUserNameScore(currentUserIsWinner ? onWinScoreChange : onLoseScoreChange);
            this.leaderboard.sync();
        });
    }
}