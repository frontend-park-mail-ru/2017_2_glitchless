/**
 * Applies `TemplatedViewMixin` to `initialClass`.
 *
 * Features to `initialClass`:
 * - on `open` method:
 *     1. `root` is saved to `this.root`
 *     2. template is initialiazed on DOM
 *     3. on next frame `initialClass`'s `open` method is called
 * - on `close` method
 *     1. `initialClass`'s `close` method is called
 *     2. `root.innerHTML = ''`
 *
 * Requirements to `initialClass`:
 * - must be extended from `View`
 * - must implement getter `template` which returns a function of type `() -> String`
 *
 * @param initialClass {Class}
 * @return {Class}
 */
export default function TemplatedViewMixin(initialClass) {
    const superOpen = initialClass.prototype.open;
    const superClose = initialClass.prototype.close;

    const Mixin = {
        open(root) {
            this.root = root;
            this.root.innerHTML = this.template();

            setTimeout(() => {
                if (superOpen) {
                    superOpen.call(this, this.root);
                }
            }, 0);
        },

        close() {
            if (superClose) {
                superClose.call(this);
            }
            this.root.innerHTML = '';
        }
    };

    Object.assign(initialClass.prototype, Mixin);
    return initialClass;
}
