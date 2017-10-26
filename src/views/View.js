/* eslint-disable no-unused-vars */

/**
 * Abstract class.
 * Represents view component on the page.
 */
class View {
    constructor(serviceLocator) {
        this.serviceLocator = serviceLocator;
    }

    /**
     * Initialize view in DOM element.
     *
     * @param root {Element} DOM element to initialize in
     * @param state {Object} Some state
     */
    open(root, state) {
    }

    /**
     * Process cleanup.
     */
    close() {
    }
}

module.exports = View;