const View = require('../View.js');
const template = require('./template.pug');


class LeadersModalView extends View {
    open(root) {
        root.innerHTML = template();
    }
}

module.exports = LeadersModalView;