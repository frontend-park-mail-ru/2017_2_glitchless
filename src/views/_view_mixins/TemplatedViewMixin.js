/**
 * Applies `TemplatedViewMixin` to `initialClass`.
 *
 * Features to `initialClass`:
 * - on `open` method:
 *     1. `root` is saved to `this.root`
 *     2. template is initialiazed on DOM
 *     3. on next frame `initialClass`'s `open` method is called
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
    const superClose = initialClass.prototype.close;

    const TemplatedViewMixin = {
        open(root) {
            this.root = root;
            this.root.innerHTML = this.template();

            setTimeout(() => {
                if (superOpen) {
                    superOpen.call(this, this.root);
                }
            }, 0);
        }
    };

    if (!superClose) {
        TemplatedViewMixin.close = () => {
            this.root.innerHTML = '';
        };
    }

    Object.assign(initialClass.prototype, TemplatedViewMixin);
    return initialClass;
}

module.exports = TemplatedViewMixin;