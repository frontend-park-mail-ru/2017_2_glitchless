/**
 * Applies `TemplatedViewMixin` to `initialClass`.
 *
 * Features to `initialClass`:
 * - on `open` method:
 *     1. template is initialiazed on DOM
 *     2. on next frame `initialClass`'s `open` method is called
 *
 * Requirements to `initialClass`:
 * - must be extended from `View`
 * - must implement getter `template` which returns a function of type `() -> String`
 *
 * @param initialClass {Class}
 * @return {Class}
 */
function TemplatedViewMixin(initialClass) {
    const superOpen = initialClass.prototype.open;

    const TemplatedViewMixin = {
        open(root) {
            root.innerHTML = this.template();

            setTimeout(() => {
                if (superOpen) {
                    superOpen.call(this, root);
                }
            }, 0);
        }
    };

    Object.assign(initialClass.prototype, TemplatedViewMixin);
    return initialClass;
}

module.exports = TemplatedViewMixin;