const View = require('../View.js');


class EmptyView extends View {
    open(root) {
        root.innerHTML = '';
    }
}

module.exports = EmptyView;