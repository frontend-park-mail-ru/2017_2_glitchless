class EventBus {

    /**
     * @return {EventBus} EventBus object with empty event list
     */
    constructor() {
        this.events = {};
    }

    /**
     * Executes all callbacks tied to the event
     *
     * @param {String} key Name of the event
     * @param {Object} args Argument with which the callbacks will be executed
     */
    emitEvent(key, args) {
        this.events[key].forEach((callback) => {
            console.log('Test');
            callback(args);
        });
    }

    /**
     * Adds a callback to the event
     *
     * @param {String} key Name of the event
     * @param {Function} callback Function that's going to be executed on emmitting event
     * @return {Function} Function that unsubscribes the callback from event
     */
    subscribeOn(key, callback) {
        if (this.events[key] == undefined) {
            this.events[key] = [];
        }
        this.events[key].push(callback);
        return () => {
            this.subscribeOff(key, callback);
        };
    }

    /**
     * Removes a callback from the event
     *
     * @param {String} key Name of the event
     * @param {Function} callback Function that's executed on emmitting event
     */
    subscribeOff(key, callback) {
        this.events[key] = this.events[key].filter((it) => {
            it != callback;
        });
    }
}

module.exports = EventBus;