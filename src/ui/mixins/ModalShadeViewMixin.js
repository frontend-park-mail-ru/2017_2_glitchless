export default function ModalShadeViewMixin(initialClass) {
    const superOpen = initialClass.prototype.open;
    const superClose = initialClass.prototype.close;

    const Mixin = {
        open(root, data = null) {
            document.getElementById('menu-shader').classList.remove('hidden');

            if (superOpen) {
                superOpen.call(this, root, data);
            }
        },

        close() {
            document.getElementById('menu-shader').classList.add('hidden');

            if (superClose) {
                superClose.call(this);
            }
        },
    };

    Object.assign(initialClass.prototype, Mixin);
    return initialClass;
}
