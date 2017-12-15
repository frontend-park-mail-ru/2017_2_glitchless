import UserModel from '../models/UserModel';

export default function(serviceLocator) {
    UserModel.loadCurrent(true, serviceLocator).then((user) => {
        serviceLocator.user = user;
        serviceLocator.eventBus.emitEvent('auth', user);
    }).catch((e) => {
        // ignore
    });
}
