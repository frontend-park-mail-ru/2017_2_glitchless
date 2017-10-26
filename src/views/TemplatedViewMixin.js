module.exports = function (initialClass) {
    const superOpen = initialClass.prototype.open;

    const TemplatedViewMixin = {
        open(root, state) {
            root.innerHTML = this.template(state);

            setTimeout(() => {
                if (superOpen) {
                    superOpen.call(this, root, state);
                }
            }, 0);
        },

        /**
         * This function must be in mixed class.
         *
         * @return Template function
         */
        // get template() {
        // }
    };

    Object.assign(initialClass.prototype, TemplatedViewMixin);
    return initialClass;
};