const View = require('../View.js');


class DefaultView extends View {
    open(root) {
        root.innerHTML = '';
    }
}

module.exports = DefaultView;