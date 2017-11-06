const View = require('../View.js');
const TemplatedViewMixin = require('../TemplatedViewMixin.js');
const template = require('./template.pug');


class LeadersModalView extends View {
    get template() {
        return template;
    }
}

module.exports = TemplatedViewMixin(LeadersModalView);