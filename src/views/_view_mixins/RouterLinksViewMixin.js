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
function RouterLinksViewMixin(initialClass) {
    const superOpen = initialClass.prototype.open;

    const RouterLinksViewMixin = {
        open(root) {
            Array.from(root.getElementsByTagName('a')).forEach(elem => {
                elem.addEventListener('click', (event) => {
                    this.serviceLocator.router.changePage(elem.getAttribute('href'));
                    event.preventDefault();
                });
            });

            if (superOpen) {
                superOpen.call(this, root);
            }
        }
    };

    Object.assign(initialClass.prototype, RouterLinksViewMixin);
    return initialClass;
}

module.exports = RouterLinksViewMixin;