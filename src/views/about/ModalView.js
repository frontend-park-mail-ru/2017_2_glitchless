const View = require('../View.js');
const template = require('./template.pug');


class AboutModalView extends View {
    open(root) {
        root.innerHTML = template();
    }
}

module.exports = AboutModalView;