/**
 * Applies `RouterLinksViewMixin` to `initialClass`.
 *
 * Features to `initialClass`:
 * - all <a> elements won't reload page on click
 *
 * Requirements to `initialClass`:
 * - must be extended from `View`
 *
 * @param initialClass {Class}
 * @return {Class}
 */
export default function RouterLinksViewMixin(initialClass) {
    const superOpen = initialClass.prototype.open;

    const Mixin = {
        open(root, data = null) {
            Array.from(root.getElementsByTagName('a')).forEach(elem => {
                elem.addEventListener('click', (event) => {
                    event.preventDefault();
                    this.serviceLocator.router.changePage(elem.getAttribute('href'));
                });
            });

            if (superOpen) {
                superOpen.call(this, root, data);
            }
        },
    };

    Object.assign(initialClass.prototype, Mixin);
    return initialClass;
}
