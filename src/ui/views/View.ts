/* tslint:disable:no-empty */

import ServiceLocator from '../../services/ServiceLocator.js';

/**
 * Abstract class.
 * Represents view component on the page.
 */
export default class View {
    public serviceLocator: ServiceLocator;

    constructor(serviceLocator: ServiceLocator) {
        this.serviceLocator = serviceLocator;
    }

    /**
     * Initialize view in DOM element.
     *
     * @param {Element} root DOM element to initialize in
     * @param {Object} data
     */
    public open(root: Element, data: object = null) {
    }

    /**
     * Process cleanup.
     */
    public close() {
    }
}
