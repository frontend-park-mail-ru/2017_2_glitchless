export default function (serviceLocator) {
    serviceLocator.leaderboard.sync();

    serviceLocator.eventBus.subscribeOn('auth', (user) => {
        serviceLocator.leaderboard.currentUserName = user ? user.login : null;
    });
}