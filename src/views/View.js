"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Abstract class.
 * Represents view component on the page.
 */
var View = /** @class */ (function () {
    function View(serviceLocator) {
        this.serviceLocator = serviceLocator;
    }
    /**
     * Initialize view in DOM element.
     *
     * @param root {Element} DOM element to initialize in
     */
    View.prototype.open = function (root) {
    };
    /**
     * Process cleanup.
     */
    View.prototype.close = function () {
    };
    return View;
}());
exports.default = View;
//# sourceMappingURL=View.js.map