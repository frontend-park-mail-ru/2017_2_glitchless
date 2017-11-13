import EventBus from '../utils/EventBus';
let instance;
if (!instance) {
    instance = new EventBus();
}

export default instance;
