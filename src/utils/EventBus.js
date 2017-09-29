class EventBus {
    constructor() {
        this.events = {};
    }

    emitEvent(key, args) {
        this.events[key].forEach((callback) =>
            callback(args)
        );
    }

    subscribeOn(key, callback) {
        if(this.events[key] === undefined){
            this.events[key] = [];
        }
        this.events[key].push(callback);
        return () => {
            EventBus.this.subscribeOff(key, callback);
        };
    }

    subscribeOff(key, callback) {
        this.events[key] = this.events[key].filter((it) => {
            it != callback;
        });
    }
}

module.exports = EventBus;