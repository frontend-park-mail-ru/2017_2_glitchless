class EventBus {
    /**
     * @return {EventBus} EventBus singleton
     */
    constructor() {
        this.events = {};
    }

    /**
     * Executes all callbacks tied to the event
     *
     * @param {String} key Name of the event
     * @param {Object} [args=null] Argument with which the callbacks will be executed
     */
    emitEvent(key, args=null) {
        this.events[key].forEach((item) => {
            let callback = item[0].bind(item[1]);
            // console.log('Test');
            if (args) {
                callback(args);
                return;
            }
            callback();
        });
    }

    /**
     * tied to the event
     *
     * @param {Function} callback Callback to wrap
     * @param {Object} context Context in which callback will be executed
     * @param {Iterable} [args=[]] Arguments with which the callback will be executed
     */
    proxy(callback, context=this, args=[]) {
        return callback.bind(context, ...args);
    }


    /**
     * Adds a callback to the event
     *
     * @param {String} key Name of the event
     * @param {Function} callback Function that's going to be executed on emmitting event
     * @param {Object} [context=this] Context in which function will be executed
     * @return {Function} Function that unsubscribes the callback from event
     */
    subscribeOn(key, callback, context=this) {
        if (this.events[key] == null) {
            this.events[key] = [];
        }
        this.events[key].push([callback, context]);
        return () => {
            this.subscribeOff(key, callback, context);
        };
    }

    /**
     * Removes a callback from the event
     *
     * @param {String} key Name of the event
     * @param {Function} callback Function that's executed on emmitting event
     */
    subscribeOff(key, callback, context) {
        this.events[key] = this.events[key].filter((it) => {
            it[0] != callback || it[1] != context;
        });
    }
}

module.exports = EventBus;