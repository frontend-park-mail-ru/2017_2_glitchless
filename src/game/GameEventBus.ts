import EventBus from '../services/EventBus';

let instance;
if (!instance) {
    instance = new EventBus();
}

export default instance;
